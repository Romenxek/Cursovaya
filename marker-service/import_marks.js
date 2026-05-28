const fs = require("fs").promises;
const path = require("path");
const mysql = require("mysql2/promise");

async function processJsonFile(filePath, connection) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    let items;

    try {
      items = JSON.parse(raw);
    } catch (parseErr) {
      console.error(`Ошибка парсинга JSON в файле ${filePath}:`, parseErr.message);
      return false;
    }

    if (!Array.isArray(items)) {
      items = [items];
    }

    await connection.beginTransaction();

    try {
      const sql = `
      INSERT INTO Markers (id, name, category, lat, lon, user_id, info, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE 
          name       = VALUES(name),
          category   = VALUES(category), 
          lat        = VALUES(lat), 
          lon        = VALUES(lon),
          user_id    = VALUES(user_id),
          info       = VALUES(info),
          updated_at = NOW()
      `;

      for (const obj of items) {
        const id = parseInt(obj.nativeId);

        const name = obj.data?.general?.name ?? null;
        const coordinates = obj.data?.general?.address?.mapPosition?.coordinates;
        const lon = Array.isArray(coordinates) ? coordinates[0] ?? null : null;
        const lat = Array.isArray(coordinates) ? coordinates[1] ?? null : null;
        const category = obj.data?.general?.category?.sysName ?? null;

        if (!id || isNaN(id)) {
          console.warn(`Пропущен объект без валидного id в файле ${filePath}`);
          continue;
        }

        await connection.execute(sql, [
          id,
          name,
          category,
          lat,
          lon,
          1,
          JSON.stringify(obj),
        ]);
      }

      await connection.commit();
      console.log(`Успешно обработан файл: ${filePath} (${items.length} записей)`);
      return true;
    } catch (txErr) {
      await connection.rollback();
      console.error(`Ошибка в транзакции файла ${filePath}:`, txErr.message);
      return false;
    }
  } catch (err) {
    console.error(`Не удалось прочитать файл ${filePath}:`, err.message);
    return false;
  }
}

async function processDirectory(dirPath) {
  const connection = await mysql.createConnection({
    host:     "marker-database",
    user:     "root",
    password: "1234",
    database: "markers",
  });

  try {
    console.log(`Начало обработки директории: ${dirPath}`);

    async function walk(currentDir) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) {
          await processJsonFile(fullPath, connection);
        }
      }
    }

    await walk(dirPath);
    console.log("Обработка всех файлов завершена");
  } catch (err) {
    console.error("Критическая ошибка при обходе директорий:", err);
  } finally {
    await connection.end();
  }
}

(async () => {
  const DATA_DIR = path.join(__dirname, "data");
  await processDirectory(DATA_DIR);
})();