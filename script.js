const form = document.getElementById("cv-form");
const preview = document.getElementById("cv-details");
const profileInput = document.getElementById("profile-pic");
const profilePreview = document.getElementById("profile-picture-preview");
const downloadBtn = document.getElementById("download-btn");
const resetBtn = document.getElementById("reset-btn");
const fontSelect = document.getElementById("font-select");
const templateSelect = document.getElementById("template-select");
const cvWrapper = document.getElementById("cv-content-wrapper");
const modeToggleBtn = document.getElementById("mode-toggle-btn");
const modeToggleCheckbox = document.getElementById("mode-toggle-checkbox");
const toggleText = modeToggleBtn.querySelector(".toggle-text");
const livePreviewToggle = document.getElementById("live-preview-toggle");
const mainContainer = document.getElementById("main-container");
const colorSelect = document.getElementById("color-select");

let profileImageDataUrl = "";

profileInput.addEventListener("change", () => {
  const file = profileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileImageDataUrl = e.target.result;
      if (livePreviewToggle.checked) updateCV();
    };
    reader.readAsDataURL(file);
  }
});



function updateToggleText() {
  if (document.body.classList.contains("light-theme")) {
    modeToggleBtn.classList.remove("on");
    modeToggleBtn.classList.add("off");
    toggleText.textContent = "Off";
    modeToggleCheckbox.checked = false;
  } else {
    modeToggleBtn.classList.remove("off");
    modeToggleBtn.classList.add("on");
    toggleText.textContent = "On";
    modeToggleCheckbox.checked = true;
  }
}

// Initial update
updateToggleText();

modeToggleCheckbox.addEventListener("change", () => {
  if (modeToggleCheckbox.checked) {
    document.body.classList.remove("light-theme");
  } else {
    document.body.classList.add("light-theme");
  }
  updateToggleText();
});




function updateCV() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const summary = document.getElementById("summary").value;
  const education = document.getElementById("education").value;
  const experience = document.getElementById("experience").value;
  const skills = document.getElementById("skills").value.split(",").map(s => s.trim()).filter(Boolean);

  let imgHTML = profileImageDataUrl
    ? `<img src="${profileImageDataUrl}" alt="Profile Picture"/>`
    : "";

  const currentTemplate = templateSelect.value;
  function formatLink(url, label) {
    if (!url) return "";
    const href = url.startsWith("http://") || url.startsWith("https://") ? url : "http://" + url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="margin-right: 15px;">${label}</a>`;
  }

  const preview = document.getElementById("cv-details");

  if (currentTemplate === 'template-sidebar') {
    profilePreview.innerHTML = `
  <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
    ${profileImageDataUrl ? `<img src="${profileImageDataUrl}" alt="Profile Picture"/>` : ""}
    <h1 style="margin-top: 10px;">${name || "Your Name"}</h1>
    ${generateWebsiteHTML()}
  </div>
`;




    preview.innerHTML = `
    <div class="sidebar">
      ${email ? `<p>${email}</p>` : ""}
      ${phone ? `<p>${phone}</p>` : ""}
    </div>
    <div class="main">
      ${summary ? `<div class=\"section\"><div class="section"><h2>Summary</h2><p>${summary.replace(/\n/g, "<br>")}</p></div></div><div class=\"page-break\"></div>` : ""}
      ${education ? `<div class=\"section\"><div class="section"><h2>Education</h2><p>${education.replace(/\n/g, "<br>")}</p></div></div><div class=\"page-break\"></div>` : ""}
      ${experience ? `<div class=\"section\"><div class="section"><h2>Experience</h2><p>${experience.replace(/\n/g, "<br>")}</p></div></div><div class=\"page-break\"></div>` : ""}
      ${generateProjectsHTML()}
      ${skills.length > 0 ? `<div class="section"><h2>Skills</h2><div>${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")}</div></div>` : ""}
    </div>
  `;
  }
  else {
    profilePreview.innerHTML = imgHTML;
    preview.innerHTML = `
    <h1 style="text-align: center;">${name || "Your Name"}</h1>
    <div style="margin-bottom: 10px;">
      ${generateWebsiteHTML()}
    </div>
    <p>${email || ""} ${phone ? '| ' + phone : ''}</p>
    ${summary ? `<div class=\"section\"><div class="section"><h2>Summary</h2><p>${summary.replace(/\n/g, "<br>")}</p></div></div><div class=\"page-break\"></div>` : ""}
    ${education ? `<div class=\"section\"><div class="section"><h2>Education</h2><p>${education.replace(/\n/g, "<br>")}</p></div></div><div class=\"page-break\"></div>` : ""}
    ${experience ? `<div class=\"section\"><div class="section"><h2>Experience</h2><p>${experience.replace(/\n/g, "<br>")}</p></div></div><div class=\"page-break\"></div>` : ""}
    ${generateProjectsHTML()}
    ${skills.length > 0 ? `<div class="section"><h2>Skills</h2><div>${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")}</div></div>` : ""}
  `;
  }

}

form.addEventListener("submit", e => e.preventDefault());

downloadBtn.addEventListener("click", () => {
  updateCV();

  setTimeout(() => {
    const element = document.getElementById("cv-content-wrapper");

    const originalMaxHeight = element.style.maxHeight;
    const originalOverflow = element.style.overflow;

    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    const opt = {
      margin: 0.3,
      filename: 'my_cv.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        scrollY: 0,
        useCORS: true,
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight
      },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.style.maxHeight = originalMaxHeight;
      element.style.overflow = originalOverflow;
    });

  }, 300);
});

resetBtn.addEventListener("click", () => {
  form.reset();
  profileImageDataUrl = "";
  profilePreview.innerHTML = "";
  preview.innerHTML = `<p style="text-align:center; color:#777;">Your CV preview will appear here...</p>`;
});

fontSelect.addEventListener("change", () => {
  cvWrapper.style.fontFamily = fontSelect.value;
  if (livePreviewToggle.checked) updateCV();
});



templateSelect.addEventListener("change", () => {
  cvWrapper.classList.remove("template-classic", "template-sidebar", "template-minimalist");
  cvWrapper.classList.add(templateSelect.value);
  if (livePreviewToggle.checked) updateCV();
});

colorSelect.addEventListener("change", () => {
  cvWrapper.classList.remove("theme-grey", "theme-blue", "theme-green");
  cvWrapper.classList.add(colorSelect.value);
  if (livePreviewToggle.checked) updateCV();
});
livePreviewToggle.addEventListener("change", () => {
  if (livePreviewToggle.checked) {
    mainContainer.classList.remove("hide-preview");
    updateCV();
  } else {
    mainContainer.classList.add("hide-preview");
  }
});

function updateTheme() {
  const themes = ["theme-grey", "theme-blue", "theme-green"];
  themes.forEach(theme => cvWrapper.classList.remove(theme));
  cvWrapper.classList.add(colorSelect.value);
}

colorSelect.addEventListener("change", () => {
  updateTheme();
  if (livePreviewToggle.checked) updateCV();
});

let websites = [];

function addWebsite() {
  const name = document.getElementById("website-name").value.trim();
  const url = document.getElementById("website-url").value.trim();

  if (name && url) {
    websites.push({ name, url });

    // Render website list with remove buttons
    renderWebsiteList();

    // Clear inputs
    document.getElementById("website-name").value = "";
    document.getElementById("website-url").value = "";

    if (livePreviewToggle.checked) updateCV();
  }
}


function generateWebsiteHTML() {
  if (websites.length === 0) return "";
  return `
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 5px;">
      ${websites.map((site, i) => {
    const capitalizedName = site.name.charAt(0).toUpperCase() + site.name.slice(1);
    const href = site.url.startsWith("http://") || site.url.startsWith("https://") ? site.url : "http://" + site.url;
    return `
          <a href="${href}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color, #4da8ff); text-decoration: none; font-weight: 500;">
            ${capitalizedName}
          </a>
          ${i < websites.length - 1 ? '<span style="color: #555;">|</span>' : ''}
        `;
  }).join('')}
    </div>
  `;
}

function renderWebsiteList() {
  const websiteList = document.getElementById("website-list");
  websiteList.innerHTML = "";  // Clear old list

  websites.forEach((site, i) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "2px 4px";
    li.style.borderBottom = "1px solid #ccc";

    const linkSpan = document.createElement("span");
    linkSpan.textContent = `${site.name} (${site.url})`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.style.background = "transparent";
    removeBtn.style.border = "none";
    removeBtn.style.color = "#888";
    removeBtn.style.fontWeight = "bold";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.fontSize = "16px";
    removeBtn.style.lineHeight = "1";
    removeBtn.style.padding = "0 6px";
    removeBtn.title = `Remove website ${site.name}`;

    removeBtn.addEventListener("click", () => {
      websites.splice(i, 1);    // Remove website from array
      renderWebsiteList();      // Re-render the list
      if (livePreviewToggle.checked) updateCV();  // Update preview
    });

    li.appendChild(linkSpan);
    li.appendChild(removeBtn);

    websiteList.appendChild(li);
  });
}


function generateProjectsHTML() {
  if (projects.length === 0) return "";
  return `
    <div class="section">
      <h2>Projects</h2>
      <ul style="padding-left: 0; list-style: none;">
        ${projects.map(p => `
          <li style="margin-bottom: 6px;">
            <a href="${p.link}" target="_blank" style="color: var(--accent-color, #2e86de); text-decoration: none;">
              <strong style="text-transform: uppercase; text-decoration: underline;">${p.name}</strong>
            </a>
            ${p.desc ? `<div style="font-size: 0.9em; color: #555;">${p.desc}</div>` : ""}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

let projects = [];

function addProject() {
  const name = document.getElementById("project-name").value.trim();
  const link = document.getElementById("project-link").value.trim();
  const desc = document.getElementById("project-desc").value.trim();

  if (name && link) {
    projects.push({ name, link, desc });

    // Render projects management list with remove buttons
    renderProjectList();

    // Clear inputs
    document.getElementById("project-name").value = "";
    document.getElementById("project-link").value = "";
    document.getElementById("project-desc").value = "";

    if (livePreviewToggle.checked) updateCV();
  }
}

function renderProjectList() {
  const projectList = document.getElementById("project-list");
  projectList.innerHTML = "";  // Clear existing list

  projects.forEach((p, i) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "2px 4px";
    li.style.borderBottom = "1px solid #ccc";

    const projectText = document.createElement("span");
    projectText.textContent = `${p.name} (${p.link})${p.desc ? ' - ' + p.desc : ''}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.style.background = "transparent";
    removeBtn.style.border = "none";
    removeBtn.style.color = "#888";
    removeBtn.style.fontWeight = "bold";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.fontSize = "16px";
    removeBtn.style.lineHeight = "1";
    removeBtn.style.padding = "0 6px";
    removeBtn.title = `Remove project ${p.name}`;

    removeBtn.addEventListener("click", () => {
      projects.splice(i, 1);    // Remove project from array
      renderProjectList();      // Re-render project management list
      if (livePreviewToggle.checked) updateCV();  // Update preview
    });

    li.appendChild(projectText);
    li.appendChild(removeBtn);

    projectList.appendChild(li);
  });
}


// Update CV on input if live preview is enabled
["name", "email", "phone", "summary", "education", "experience", "skills"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    if (livePreviewToggle.checked) updateCV();
  });
});