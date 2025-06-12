if (!document.getElementById("gd-container")) {
  const container = document.createElement("div");
  container.id = "gd-container";
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 480px;
    height: 360px;
    background: white;
    border: 2px solid black;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    overflow: hidden;
    transform: scale(0.5);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease, height 0.3s ease;
  `;

  const audio = document.createElement("audio");
  audio.src = "https://drive.google.com/uc?export=download&id=14FRtf-DZnNEziFnay-xeYbEw3MjGLLXY";
  audio.loop = true;
  audio.volume = 0.5;

  const header = document.createElement("div");
  header.style.cssText = `
    background: #333;
    color: white;
    padding: 5px 10px;
    cursor: move;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  const leftControls = document.createElement("div");
  const resizeLabel = document.createElement("span");
  resizeLabel.textContent = "Resize:";
  resizeLabel.style.marginRight = "5px";

  const resizePlus = document.createElement("button");
  resizePlus.textContent = "+";
  resizePlus.style.cssText = "margin-right: 2px; cursor: pointer;";
  let isCollapsed = false;
  resizePlus.onclick = () => {
    if (!isCollapsed) {
      container.style.width = container.offsetWidth + 50 + "px";
      container.style.height = container.offsetHeight + 30 + "px";
    }
  };

  const resizeMinus = document.createElement("button");
  resizeMinus.textContent = "–";
  resizeMinus.style.cssText = "margin-right: 10px; cursor: pointer;";
  resizeMinus.onclick = () => {
    if (!isCollapsed) {
      container.style.width = Math.max(200, container.offsetWidth - 50) + "px";
      container.style.height = Math.max(150, container.offsetHeight - 30) + "px";
    }
  };

  leftControls.appendChild(resizeLabel);
  leftControls.appendChild(resizePlus);
  leftControls.appendChild(resizeMinus);

  const titleSpan = document.createElement("span");
  titleSpan.textContent = "Main Menu";
  titleSpan.style.cssText = "flex-grow: 1; text-align: center;";

  const buttonContainer = document.createElement("div");

  const collapseBtn = document.createElement("button");
  collapseBtn.textContent = "-";
  collapseBtn.style.cssText = "margin-left: 5px; cursor: pointer;";
  collapseBtn.onclick = () => {
    if (!isCollapsed) {
      contentWrapper.style.opacity = "0";
      contentWrapper.style.pointerEvents = "none";
      container.style.height = header.offsetHeight + "px";
      audio.pause();
    } else {
      contentWrapper.style.opacity = "1";
      contentWrapper.style.pointerEvents = "auto";
      container.style.height = originalStyles.height;
      if (!iframeVisible()) audio.play();
    }
    isCollapsed = !isCollapsed;
  };

  const fullscreenBtn = document.createElement("button");
  fullscreenBtn.textContent = "⛶";
  fullscreenBtn.style.cssText = "margin-left: 5px; cursor: pointer;";
  let isFullscreen = false;
  const originalStyles = {
    width: "480px",
    height: "360px",
    left: null,
    top: null,
    right: "20px",
    bottom: "20px"
  };
  fullscreenBtn.onclick = () => {
    if (!isFullscreen) {
      Object.assign(originalStyles, {
        width: container.style.width,
        height: container.style.height,
        left: container.style.left,
        top: container.style.top,
        right: container.style.right,
        bottom: container.style.bottom
      });
      container.style.top = "0";
      container.style.left = "0";
      container.style.right = "0";
      container.style.bottom = "0";
      container.style.width = "100vw";
      container.style.height = "100vh";
      isFullscreen = true;
    } else {
      container.style.width = originalStyles.width;
      container.style.height = originalStyles.height;
      container.style.left = originalStyles.left;
      container.style.top = originalStyles.top;
      container.style.right = originalStyles.right;
      container.style.bottom = originalStyles.bottom;
      isFullscreen = false;
    }
  };

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back";
  backBtn.style.cssText = "margin-left: 5px; cursor: pointer; display: none;";
  backBtn.onclick = () => {
    iframe.src = "";
    iframe.style.display = "none";
    backBtn.style.display = "none";

    if (!contentWrapper.contains(menu)) contentWrapper.appendChild(menu);
    if (!contentWrapper.contains(gdToolsMenu)) contentWrapper.appendChild(gdToolsMenu);
    if (!contentWrapper.contains(extraGamesMenu)) contentWrapper.appendChild(extraGamesMenu);

    menu.style.display = "flex";
    gdToolsMenu.style.display = "none";
    extraGamesMenu.style.display = "none";

    titleSpan.textContent = "Main Menu";
  };

  const hideBtn = document.createElement("button");
  hideBtn.textContent = "✕";
  hideBtn.style.cssText = "margin-left: 5px; cursor: pointer;";
  hideBtn.onclick = () => {
    container.style.display = "none";
    audio.pause();
    audio.currentTime = 0;
  };

  buttonContainer.appendChild(collapseBtn);
  buttonContainer.appendChild(fullscreenBtn);
  buttonContainer.appendChild(backBtn);
  buttonContainer.appendChild(hideBtn);

  header.appendChild(leftControls);
  header.appendChild(titleSpan);
  header.appendChild(buttonContainer);

  const contentWrapper = document.createElement("div");
  contentWrapper.style.cssText = `
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  `;

  // Main menu
  const menu = document.createElement("div");
  menu.style.cssText = `
    background: black;
    color: white;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
  `;

  const selectGameLabel = document.createElement("div");
  selectGameLabel.textContent = "Select Game";
  selectGameLabel.style.cssText = `
    color: white;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  `;
  menu.appendChild(selectGameLabel);

  const makeGameButton = (text, url, title) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.cssText = `
      background: grey;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
    `;
    btn.onclick = () => launchGame(url, title);
    return btn;
  };

  menu.appendChild(makeGameButton("Geometry Dash", "https://geometrydashlite.io", "Geometry Dash! Ctrl + Q to hide/unhide."));
  menu.appendChild(makeGameButton("Geometry Dash Meltdown", "https://geometrydashmeltdown.io", "Geometry Dash Meltdown! Ctrl + Q to hide/unhide."));
  menu.appendChild(makeGameButton("Geometry Dash Breeze! (unofficial)", "https://geometrydashbreeze.com/#google_vignette", "Geometry Dash Breeze!"));

  // Link to GD Tools menu
  const toolsLink = document.createElement("a");
  toolsLink.textContent = "GD Tools (unplayable)";
  toolsLink.href = "#";
  toolsLink.style.cssText = `
    color: grey;
    text-decoration: underline;
    font-size: 14px;
    margin-top: -5px;
    cursor: pointer;
  `;
  toolsLink.onclick = (e) => {
    e.preventDefault();
    menu.style.display = "none";
    gdToolsMenu.style.display = "flex";
    extraGamesMenu.style.display = "none";
    if (!contentWrapper.contains(gdToolsMenu)) {
      contentWrapper.appendChild(gdToolsMenu);
    }
    backBtn.style.display = "inline-block";
    titleSpan.textContent = "GD Tools (unplayable)";
  };
  menu.appendChild(toolsLink);

  // New tab link for Extra Games menu
  const extraGamesLink = document.createElement("a");
  extraGamesLink.textContent = "Extra Games";
  extraGamesLink.href = "#";
  extraGamesLink.style.cssText = `
    color: grey;
    text-decoration: underline;
    font-size: 14px;
    margin-top: 5px;
    cursor: pointer;
  `;
  extraGamesLink.onclick = (e) => {
    e.preventDefault();
    menu.style.display = "none";
    gdToolsMenu.style.display = "none";
    extraGamesMenu.style.display = "flex";
    if (!contentWrapper.contains(extraGamesMenu)) {
      contentWrapper.appendChild(extraGamesMenu);
    }
    backBtn.style.display = "inline-block";
    titleSpan.textContent = "Extra Games";
  };
  menu.appendChild(extraGamesLink);

  // GD Tools menu
  const gdToolsMenu = document.createElement("div");
  gdToolsMenu.style.cssText = menu.style.cssText;
  gdToolsMenu.style.display = "none";

  const toolsLabel = document.createElement("div");
  toolsLabel.textContent = "GD Tools (unplayable)";
  toolsLabel.style.cssText = `
    color: white;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  `;
  gdToolsMenu.appendChild(toolsLabel);

  const makeToolButton = (text, url) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.cssText = `
      background: grey;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
    `;
    btn.onclick = () => {
      iframe.src = url;
      iframe.style.display = "block";
      gdToolsMenu.style.display = "none";
      backBtn.style.display = "inline-block";
      titleSpan.textContent = text;
    };
    return btn;
  };

  gdToolsMenu.appendChild(makeToolButton("GD Save Editor", "https://gdcolon.com/gdsave/"));
  gdToolsMenu.appendChild(makeToolButton("GD Font Generator", "https://gdcolon.com/gdfont"));
  gdToolsMenu.appendChild(makeToolButton("GD Comment Viewer", "https://gdcolon.com/gdcomment"));
  gdToolsMenu.appendChild(makeToolButton("GD Icon Kit", "https://gdbrowser.com/iconkit/"));
  gdToolsMenu.appendChild(makeToolButton("GD Browser (Classic)", "https://gdbrowser.com/"));

  // Extra Games menu
  const extraGamesMenu = document.createElement("div");
  extraGamesMenu.style.cssText = menu.style.cssText;
  extraGamesMenu.style.display = "none";

  const extraGamesLabel = document.createElement("div");
  extraGamesLabel.textContent = "Extra Games";
  extraGamesLabel.style.cssText = `
    color: white;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  `;
  extraGamesMenu.appendChild(extraGamesLabel);

  const makeExtraGameButton = (text, url) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.cssText = `
      background: grey;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
    `;
    btn.onclick = () => {
      iframe.src = url;
      iframe.style.display = "block";
      extraGamesMenu.style.display = "none";
      backBtn.style.display = "inline-block";
      titleSpan.textContent = text;
      audio.pause();
    };
    return btn;
  };

  extraGamesMenu.appendChild(makeExtraGameButton("Sans", "https://jcw87.github.io/c2-sans-fight/"));
  extraGamesMenu.appendChild(makeExtraGameButton("Undyne", "https://doodle-pile.gitlab.io/unfair-undyne/v0.99/"));
  extraGamesMenu.appendChild(makeExtraGameButton("Thirty Dollar Website", "https://thirtydollar.website/"));

  const iframe = document.createElement("iframe");
  iframe.style.cssText = `
    flex-grow: 1;
    width: 100%;
    height: 100%;
    border: none;
    display: none;
  `;

  const iframeVisible = () => iframe.style.display !== "none";

  const launchGame = (url, title) => {
    iframe.src = url;
    iframe.style.display = "block";
    backBtn.style.display = "inline-block";
    menu.style.display = "none";
    gdToolsMenu.style.display = "none";
    extraGamesMenu.style.display = "none";
    titleSpan.textContent = title;
    audio.pause();
  };

  contentWrapper.appendChild(menu);
  contentWrapper.appendChild(gdToolsMenu);
  contentWrapper.appendChild(extraGamesMenu);
  contentWrapper.appendChild(iframe);
  container.appendChild(header);
  container.appendChild(contentWrapper);
  document.body.appendChild(container);
  document.body.appendChild(audio);

  setTimeout(() => {
    container.style.transform = "scale(1)";
    container.style.opacity = "1";
    audio.play();
  }, 50);

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", (e) => {
    if (e.target.tagName === "BUTTON" || isFullscreen) return;
    isDragging = true;
    offsetX = e.clientX - container.offsetLeft;
    offsetY = e.clientY - container.offsetTop;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging && !isFullscreen) {
      container.style.left = `${e.clientX - offsetX}px`;
      container.style.top = `${e.clientY - offsetY}px`;
      container.style.right = "auto";
      container.style.bottom = "auto";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "";
  });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "q") {
      const visible = container.style.display !== "none";
      container.style.display = visible ? "none" : "flex";
      if (visible) {
        audio.pause();
        audio.currentTime = 0;
      } else {
        if (!iframeVisible()) audio.play();
      }
    }
  });
}
