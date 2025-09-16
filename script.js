const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const renameBtn = document.getElementById("renameBtn");
const status = document.getElementById("status");

let storedFiles = []; // temporary storage in browser

// Click drop zone to open file dialog
dropZone.addEventListener("click", () => fileInput.click());

// Drag and Drop Handling
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  handleFiles(e.dataTransfer.files);
});

// File Input
fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

function handleFiles(files) {
  for (let file of files) {
    if (file.type.startsWith("image/")) {
      storedFiles.push(file);
    }
  }
  renderFileList();
}

function renderFileList() {
  fileList.innerHTML = "";
  storedFiles.forEach((file, index) => {
    const li = document.createElement("li");
    li.textContent = file.name;
    fileList.appendChild(li);
  });
}

// Rename + Download ZIP
renameBtn.addEventListener("click", async () => {
  const oldLoc = document.getElementById("oldLocation").value.trim();
  const newLoc = document.getElementById("newLocation").value.trim();

  if (!storedFiles.length) {
    alert("Please add some images first!");
    return;
  }
  if (!oldLoc || !newLoc) {
    alert("Please enter old and new location strings!");
    return;
  }

  const zip = new JSZip();

  storedFiles.forEach(file => {
    let newName = file.name.replace(oldLoc, newLoc);
    zip.file(newName, file);
  });

  const content = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = "renamed_images.zip";
  a.click();

  status.textContent = `✅ Renamed ${storedFiles.length} files and downloaded ZIP!`;
});
