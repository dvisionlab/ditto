// File system API utilities functions
// see https://www.html5rocks.com/it/tutorials/file/filesystem//

// Local functions

async function readDirectory(item, allEntries) {
  if (item.isDirectory) {
    const directoryReader = item.createReader();

    await new Promise<void>(resolve => {
      // Call the directoryReader.readEntries() until no more results are returned
      const readEntries = () => {
        directoryReader.readEntries(async entries => {
          if (!entries.length) {
            resolve();
          } else {
            await Promise.all(
              entries.map(async entry => {
                await readDirectory(entry, allEntries);
              })
            ).then(() => readEntries());
          }
        });
      };

      readEntries();
    });
  } else {
    allEntries.push(item);
  }
}

// Public functions

export async function readFiles(event) {
  let entries: any[] = [];

  // if directory support is available
  if (event.dataTransfer && event.dataTransfer.items) {
    const items = event.dataTransfer.items;
    await Promise.all(
      [...items].map(async item => {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await readDirectory(entry, entries);
        }
      })
    );
  } else {
    // Fallback
    entries = [...(event.target.files || event.dataTransfer.files)];
    return { files: entries, errors: [] };
  }

  if (!entries.length) {
    return { files: [], errors: [] };
  }

  // Convert entries into files
  let files: File[] = [];
  let errors: any[] = [];
  await Promise.all(
    entries.map(async entry => {
      return await new Promise<void>(resolve => {
        entry.file(
          file => {
            files.push(file);
            resolve();
          },
          error => {
            errors.push({ entry, error });
            resolve();
          }
        );
      });
    })
  );

  return { files, errors };
}

export const onDragOver = event => {
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = "copy";
};
