import "./styles.css";
import { MAX_BYTES, MAX_FILES, cleanFile, isAllowedFile } from "./clean";

const dropzone = document.querySelector<HTMLDivElement>("#dropzone")!;
const fileInput = document.querySelector<HTMLInputElement>("#file-input")!;
const cleanBtn = document.querySelector<HTMLButtonElement>("#clean-btn")!;
const statusEl = document.querySelector<HTMLDivElement>("#status")!;
const fileList = document.querySelector<HTMLUListElement>("#file-list")!;
const results = document.querySelector<HTMLDivElement>("#results")!;
const injectExif = document.querySelector<HTMLInputElement>("#inject-exif")!;

let queue: File[] = [];

function setStatus(msg: string, isError = false): void {
  statusEl.textContent = msg;
  statusEl.classList.toggle("error", isError);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[c] ?? c;
  });
}

function renderQueue(): void {
  fileList.hidden = queue.length === 0;
  fileList.innerHTML = queue
    .map(
      (f, i) =>
        `<li><span>${escapeHtml(f.name)} · ${(f.size / 1024).toFixed(1)} KB</span><button type="button" class="btn btn-ghost" data-remove="${i}">Remove</button></li>`
    )
    .join("");
  cleanBtn.disabled = queue.length === 0;
}

function addFiles(fileListLike: FileList | File[]): void {
  const incoming = Array.from(fileListLike);
  const next: File[] = [];
  for (const file of incoming) {
    if (queue.length + next.length >= MAX_FILES) {
      setStatus(`Batch limit is ${MAX_FILES} files.`, true);
      break;
    }
    if (!isAllowedFile(file)) {
      setStatus(`${file.name}: unsupported type.`, true);
      continue;
    }
    if (file.size > MAX_BYTES) {
      setStatus(`${file.name}: over 15MB.`, true);
      continue;
    }
    next.push(file);
  }
  queue = queue.concat(next);
  renderQueue();
  if (next.length) setStatus(`${queue.length} file(s) ready.`);
}

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});
fileInput.addEventListener("change", () => {
  if (fileInput.files) addFiles(fileInput.files);
  fileInput.value = "";
});

(["dragenter", "dragover"] as const).forEach((ev) => {
  dropzone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropzone.classList.add("is-drag");
  });
});
(["dragleave", "drop"] as const).forEach((ev) => {
  dropzone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropzone.classList.remove("is-drag");
  });
});
dropzone.addEventListener("drop", (e) => {
  if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
});

fileList.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-remove]");
  if (!btn) return;
  queue.splice(Number(btn.dataset.remove), 1);
  renderQueue();
});

cleanBtn.addEventListener("click", async () => {
  if (!queue.length) return;
  cleanBtn.disabled = true;
  cleanBtn.setAttribute("aria-busy", "true");
  results.hidden = false;
  results.innerHTML = "";
  setStatus("Cleaning in your browser…");

  let ok = 0;
  for (const file of queue) {
    try {
      const { blob, outName, preview } = await cleanFile(file, injectExif.checked);
      const url = URL.createObjectURL(blob);
      const card = document.createElement("div");
      card.className = "result-card";
      card.innerHTML = `<img alt="" src="${preview}" /><span>${escapeHtml(outName)}</span><a href="${url}" download="${escapeHtml(outName)}">Download</a>`;
      results.appendChild(card);
      ok += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : "failed";
      const card = document.createElement("div");
      card.className = "result-card";
      card.innerHTML = `<span>${escapeHtml(file.name)} — ${escapeHtml(message)}</span>`;
      results.appendChild(card);
    }
  }
  setStatus(`Done. ${ok} of ${queue.length} cleaned. Nothing was uploaded.`);
  cleanBtn.disabled = false;
  cleanBtn.removeAttribute("aria-busy");
});
