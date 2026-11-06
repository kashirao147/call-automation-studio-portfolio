(function () {
  const sectionsWrap = document.querySelector("[data-sections]");
  const fieldsWrap = document.querySelector("[data-fields]");
  const paneTitle = document.querySelector("[data-pane-title]");
  const paneSubtitle = document.querySelector("[data-pane-subtitle]");
  const statusNode = document.querySelector("[data-status]");
  const saveButton = document.querySelector("[data-save]");
  const resetButton = document.querySelector("[data-reset]");
  const exportButton = document.querySelector("[data-export]");
  const adminKeyInput = document.querySelector("[data-admin-key]");

  if (
    !sectionsWrap ||
    !fieldsWrap ||
    !paneTitle ||
    !paneSubtitle ||
    !statusNode ||
    !saveButton ||
    !resetButton ||
    !exportButton ||
    !adminKeyInput
  ) {
    return;
  }

  const CONTENT_SECTIONS = [
    { id: "nav", label: "Navigation", prefixes: ["nav_", "header_cta"] },
    { id: "hero", label: "Hero", prefixes: ["hero_"] },
    { id: "about_text", label: "About (Text)", prefixes: ["about_"] },
    { id: "case_text", label: "Case Studies (Text)", prefixes: ["case_"] },
    { id: "process_text", label: "Process (Text)", prefixes: ["process_"] },
    { id: "integrations_text", label: "Integrations (Text)", prefixes: ["int_", "integrations_"] },
    { id: "use_cases_text", label: "Use Cases (Text)", prefixes: ["use_cases_"] },
    { id: "who_text", label: "Who It's For (Text)", prefixes: ["who_"] },
    { id: "contact_text", label: "Contact (Text)", prefixes: ["contact_"] },
    { id: "faq_text", label: "FAQ (Text)", prefixes: ["faq_"] },
    { id: "audit_text", label: "Audit CTA (Text)", prefixes: ["audit_"] },
    { id: "footer_text", label: "Footer (Text)", prefixes: ["footer_"] },
  ];

  const REPEATER_SECTIONS = [
    {
      id: "service_pages",
      label: "Sitemap URLs",
      key: "service_pages",
      fields: [
        { key: "path", label: "Path (e.g. /ai-service/)", multiline: false },
        { key: "changefreq", label: "Changefreq (daily/weekly/monthly)", multiline: false },
        { key: "priority", label: "Priority (0.1 to 1.0)", multiline: false },
      ],
      createItem: () => ({
        path: "/new-service-page/",
        changefreq: "weekly",
        priority: "0.8",
      }),
    },
    {
      id: "partner_logos",
      label: "Top Moving Logos",
      key: "partner_logos",
      fields: [
        { key: "imageUrl", label: "Image URL", multiline: false },
        { key: "alt", label: "Image Alt Text", multiline: false },
        { key: "link", label: "Optional Link URL", multiline: false },
      ],
      createItem: () => ({
        imageUrl: "https://example.com/logo.png",
        alt: "Partner Name",
        link: "",
      }),
    },
    {
      id: "who_its_for",
      label: "Who It's For Cards",
      key: "who_its_for",
      fields: [
        { key: "title", label: "Title", multiline: false },
        { key: "text", label: "Description", multiline: true },
      ],
      createItem: () => ({
        title: "Industry Segment",
        text: "How AI voice + automation helps this segment.",
      }),
    },
    {
      id: "use_cases",
      label: "Use Case Cards",
      key: "use_cases",
      fields: [
        { key: "title", label: "Title", multiline: false },
        { key: "description", label: "Description", multiline: true },
        { key: "outcomes", label: "Outcomes (one per line)", multiline: true, list: true },
      ],
      createItem: () => ({
        title: "Use Case",
        description: "Use case description...",
        outcomes: ["Outcome one", "Outcome two", "Outcome three"],
      }),
    },
    {
      id: "faq_items",
      label: "FAQ Items",
      key: "faq_items",
      fields: [
        { key: "question", label: "Question", multiline: false },
        { key: "answer", label: "Answer", multiline: true },
      ],
      createItem: () => ({
        question: "Your question?",
        answer: "Your answer...",
      }),
    },
    {
      id: "pricing_packages",
      label: "Pricing Packages",
      key: "pricing_packages",
      fields: [
        { key: "badge", label: "Badge", multiline: false },
        { key: "title", label: "Plan Name", multiline: false },
        { key: "price", label: "Price", multiline: false },
        { key: "period", label: "Period (e.g. /month)", multiline: false },
        { key: "description", label: "Description", multiline: true },
        { key: "features", label: "Features (one per line)", multiline: true, list: true },
        { key: "cta", label: "Button Text", multiline: false },
        { key: "ctaUrl", label: "Button URL", multiline: false },
        { key: "highlight", label: "Highlight (true/false)", multiline: false },
      ],
      createItem: () => ({
        badge: "Plan",
        title: "New Plan",
        price: "$99",
        period: "/month",
        description: "Package description...",
        features: ["Feature one", "Feature two", "Feature three"],
        cta: "Choose Plan",
        ctaUrl: "https://calendly.com/dpleducationsystem/meeting",
        highlight: "false",
      }),
    },
    {
      id: "about_items",
      label: "About Items",
      key: "about_items",
      fields: [
        { key: "title", label: "Title", multiline: false },
        { key: "text", label: "Description", multiline: true },
      ],
      createItem: () => ({ title: "New Item", text: "Write description..." }),
    },
    {
      id: "case_studies",
      label: "Case Study Slides",
      key: "case_studies",
      fields: [
        { key: "mediaClass", label: "Media Class", multiline: false },
        { key: "logo", label: "Logo Text", multiline: false },
        { key: "tag", label: "Tag", multiline: false },
        { key: "title", label: "Title", multiline: false },
        { key: "description", label: "Description", multiline: true },
        { key: "outcomes", label: "Outcomes (one per line)", multiline: true, list: true },
        { key: "cta", label: "CTA Text", multiline: false },
        { key: "ctaUrl", label: "CTA URL", multiline: false },
      ],
      createItem: () => ({
        mediaClass: "case-media-masterworks",
        logo: "NEW CASE",
        tag: "Category",
        title: "New Case Study",
        description: "Case study description...",
        outcomes: ["Outcome one", "Outcome two", "Outcome three"],
        cta: "Schedule Strategic Consultation",
        ctaUrl: "https://calendly.com/dpleducationsystem/meeting",
      }),
    },
    {
      id: "process_steps",
      label: "Process Steps",
      key: "process_steps",
      fields: [
        { key: "icon", label: "Icon", multiline: false },
        { key: "title", label: "Title", multiline: false },
        { key: "text", label: "Description", multiline: true },
      ],
      createItem: () => ({ icon: "AI", title: "New Step", text: "Step details..." }),
    },
    {
      id: "integrations",
      label: "Integration Cards",
      key: "integrations",
      fields: [
        { key: "logo", label: "Logo Label", multiline: false },
        { key: "title", label: "Title", multiline: false },
        { key: "description", label: "Description", multiline: true },
        { key: "points", label: "Points (one per line)", multiline: true, list: true },
        { key: "cta", label: "CTA Text", multiline: false },
        { key: "ctaUrl", label: "CTA URL", multiline: false },
      ],
      createItem: () => ({
        logo: "New Tool",
        title: "New Integration",
        description: "Integration description...",
        points: ["Point one", "Point two", "Point three"],
        cta: "Learn More",
        ctaUrl: "#",
      }),
    },
  ];

  const ALL_SECTIONS = [
    ...CONTENT_SECTIONS.map((s) => ({ ...s, type: "content" })),
    ...REPEATER_SECTIONS.map((s) => ({ ...s, type: "repeater" })),
  ];

  let activeSectionId = ALL_SECTIONS[0].id;
  let contentState = {};
  let repeatersState = {};
  let contentDefaultMap = {};
  let lastSavedSnapshot = "";

  const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();

  const setStatus = (message, type = "") => {
    statusNode.textContent = message;
    statusNode.classList.remove("error", "success");
    if (type) {
      statusNode.classList.add(type);
    }
  };

  const getIndexContentMap = async () => {
    const response = await fetch("/index.html", { cache: "no-store" });
    const html = await response.text();
    const dom = new DOMParser().parseFromString(html, "text/html");
    const map = {};
    dom.querySelectorAll("[data-content-key]").forEach((node) => {
      const key = node.getAttribute("data-content-key");
      if (!key || map[key] !== undefined) {
        return;
      }
      map[key] = normalizeText(node.textContent);
    });
    return map;
  };

  const renderSidebar = () => {
    sectionsWrap.innerHTML = "";
    ALL_SECTIONS.forEach((section) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `section-btn${section.id === activeSectionId ? " active" : ""}`;
      btn.innerHTML = `
        ${section.label}
        <small>${section.type === "content" ? "Text Fields" : "Add/Remove Items"}</small>
      `;
      btn.addEventListener("click", () => {
        activeSectionId = section.id;
        renderSidebar();
        renderPane();
      });
      sectionsWrap.append(btn);
    });
  };

  const createField = (labelText, value, onInput, rows = 3) => {
    const field = document.createElement("div");
    field.className = "field";
    const label = document.createElement("label");
    label.textContent = labelText;
    const textarea = document.createElement("textarea");
    textarea.rows = rows;
    textarea.value = value;
    textarea.addEventListener("input", () => onInput(textarea.value));
    field.append(label, textarea);
    return field;
  };

  const uploadImage = async ({ file, adminKey }) => {
    const asDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read selected file."));
      reader.readAsDataURL(file);
    });

    const response = await fetch("/api/drive-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": String(adminKey || ""),
      },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type,
        base64Data: asDataUrl,
      }),
    });

    const rawText = await response.text();
    let parsed = {};
    try {
      parsed = rawText ? JSON.parse(rawText) : {};
    } catch {
      parsed = {};
    }

    if (!response.ok) {
      throw new Error(parsed.error || "Upload failed.");
    }

    return parsed.file || {};
  };

  const renderContentSection = (section) => {
    paneTitle.textContent = section.label;
    paneSubtitle.textContent = "Edit text content for this section.";
    fieldsWrap.innerHTML = "";

    const keys = Object.keys(contentDefaultMap).filter((key) =>
      section.prefixes.some((prefix) => key.startsWith(prefix))
    );

    if (!keys.length) {
      fieldsWrap.textContent = "No fields found.";
      return;
    }

    keys.sort().forEach((key) => {
      const field = createField(
        key,
        contentState[key] ?? contentDefaultMap[key] ?? "",
        (value) => {
          contentState[key] = value;
        },
        3
      );
      fieldsWrap.append(field);
    });
  };

  const renderRepeaterSection = (section) => {
    paneTitle.textContent = section.label;
    paneSubtitle.textContent = "Add, remove, and edit items.";
    fieldsWrap.innerHTML = "";

    const tools = document.createElement("div");
    tools.className = "repeater-tools";
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.textContent = "Add Item";
    addBtn.addEventListener("click", () => {
      repeatersState[section.key].push(section.createItem());
      renderPane();
    });
    tools.append(addBtn);
    fieldsWrap.append(tools);

    const items = repeatersState[section.key] || [];
    items.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "field";

      const top = document.createElement("div");
      top.className = "repeater-item-top";
      const label = document.createElement("p");
      label.textContent = `${section.label} Item ${index + 1}`;
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-item";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        repeatersState[section.key].splice(index, 1);
        renderPane();
      });
      top.append(label, removeBtn);
      card.append(top);

      section.fields.forEach((fieldDef) => {
        const value = item[fieldDef.key];
        const currentValue = fieldDef.list
          ? Array.isArray(value)
            ? value.join("\n")
            : ""
          : String(value ?? "");
        let inputRef = null;
        const field = createField(
          fieldDef.label,
          currentValue,
          (newValue) => {
            if (fieldDef.list) {
              item[fieldDef.key] = newValue
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean);
            } else {
              item[fieldDef.key] = newValue;
            }
          },
          fieldDef.multiline ? 5 : 2
        );
        inputRef = field.querySelector("textarea");

        if (section.id === "partner_logos" && fieldDef.key === "imageUrl") {
          const uploadWrap = document.createElement("div");
          uploadWrap.className = "repeater-tools";

          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = "image/*";
          fileInput.className = "upload-input";

          const uploadBtn = document.createElement("button");
          uploadBtn.type = "button";
            uploadBtn.textContent = "Upload Image";
          uploadBtn.addEventListener("click", async () => {
            const adminKey = adminKeyInput.value.trim();
            if (!adminKey) {
              setStatus("Please enter Admin API Key first.", "error");
              return;
            }

            const file = fileInput.files && fileInput.files[0];
            if (!file) {
              setStatus("Please select an image first.", "error");
              return;
            }

            uploadBtn.disabled = true;
            uploadBtn.textContent = "Uploading...";
            setStatus("Uploading image...");

            try {
              const uploaded = await uploadImage({ file, adminKey });
              const imageUrl = String(uploaded.imageUrl || uploaded.directUrl || "").trim();
              if (!imageUrl) {
                throw new Error("Upload succeeded but image URL is missing.");
              }
              item[fieldDef.key] = imageUrl;
              if (inputRef) {
                inputRef.value = imageUrl;
              }
              setStatus("Image uploaded successfully. Save Changes to publish.", "success");
            } catch (error) {
              const message =
                error instanceof Error && error.message
                  ? error.message
                  : "Failed to upload image.";
              setStatus(message, "error");
            } finally {
              uploadBtn.disabled = false;
              uploadBtn.textContent = "Upload Image";
            }
          });

          uploadWrap.append(fileInput, uploadBtn);
          field.append(uploadWrap);
        }
        card.append(field);
      });

      fieldsWrap.append(card);
    });
  };

  const renderPane = () => {
    const section = ALL_SECTIONS.find((x) => x.id === activeSectionId);
    if (!section) {
      return;
    }
    if (section.type === "content") {
      renderContentSection(section);
      return;
    }
    renderRepeaterSection(section);
  };

  const init = async () => {
    try {
      contentDefaultMap = await getIndexContentMap();
      const saved = window.PortfolioContent.getSavedData();
      const defaultRepeaters = window.PortfolioContent.getDefaultRepeaters();

      contentState = { ...contentDefaultMap, ...(saved.content || {}) };
      repeatersState = {};
      REPEATER_SECTIONS.forEach((section) => {
        const source =
          saved.repeaters && Array.isArray(saved.repeaters[section.key])
            ? saved.repeaters[section.key]
            : defaultRepeaters[section.key] || [];
        repeatersState[section.key] = JSON.parse(JSON.stringify(source));
      });

      try {
        const cloud = await window.PortfolioContent.fetchCloudData();
        contentState = { ...contentDefaultMap, ...(cloud.content || {}) };
        REPEATER_SECTIONS.forEach((section) => {
          if (Array.isArray(cloud.repeaters?.[section.key])) {
            repeatersState[section.key] = JSON.parse(
              JSON.stringify(cloud.repeaters[section.key])
            );
          }
        });
        window.PortfolioContent.saveData({
          content: contentState,
          repeaters: repeatersState,
        });
        setStatus("Admin panel ready. Cloud content loaded.", "success");
      } catch {
        setStatus("Admin panel ready. Cloud unavailable, using local data.", "error");
      }

      lastSavedSnapshot = JSON.stringify({
        content: contentState,
        repeaters: repeatersState,
      });

      renderSidebar();
      renderPane();
    } catch {
      setStatus("Could not initialize admin panel.", "error");
    }
  };

  saveButton.addEventListener("click", async () => {
    const adminKey = adminKeyInput.value.trim();
    if (!adminKey) {
      setStatus("Please enter Admin API Key first.", "error");
      return;
    }

    const nextSnapshot = JSON.stringify({
      content: contentState,
      repeaters: repeatersState,
    });

    if (nextSnapshot === lastSavedSnapshot) {
      setStatus("No changes to save.", "success");
      return;
    }

    try {
      await window.PortfolioContent.saveCloudData(
        {
          content: contentState,
          repeaters: repeatersState,
        },
        adminKey
      );
      lastSavedSnapshot = nextSnapshot;
      setStatus("Saved to cloud successfully. Refresh website tab to view updates.", "success");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Could not save to cloud.";
      setStatus(message, "error");
    }
  });

  resetButton.addEventListener("click", async () => {
    window.PortfolioContent.clearContent();
    await init();
    setStatus("Reset to default content.", "success");
  });

  exportButton.addEventListener("click", () => {
    const state = {
      content: contentState,
      repeaters: repeatersState,
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio-content-full.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("Exported JSON.", "success");
  });

  init();
})();
