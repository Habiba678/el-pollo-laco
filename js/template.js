function getTopBarTemplate() {
  return `
    <div id="gameToolbar" class="game-toolbar">
      ${getDesktopToolsTemplate()}
      ${getCompactToolsTemplate()}
    </div>
  `;
}

function getDesktopToolsTemplate() {
  return `
    <div class="toolbar-desktop-group wide-screen-tools">
      ${getIconButton("toolbar-icon-button game-only-tool", "returnToStartScreen()", "./assets/img/8_coin/back.png", "Zurück")}
      ${getSoundButton("toolbar-icon-button", "soundIconDesktop", "soundLineDesktop")}
      ${getIconButton("toolbar-icon-button game-only-tool", "mobileControls.toggleFullscreen()", "./assets/img/8_coin/fullscreen.png", "Vollbild")}
      ${getIconButton("toolbar-icon-button game-only-tool", "restartRoundDirectly()", "./assets/img/8_coin/neustart.png", "Neustart", "restartToolbarButton")}
    </div>
  `;
}

function getCompactToolsTemplate() {
  return `
    <div class="quick-tools-wrap compact-layer">
      <div id="quickToolsPanel" class="quick-tools-panel">
        ${getIconButton("quick-tool-button game-only-tool", "returnToStartScreen()", "./assets/img/8_coin/back.png", "Zurück")}
        ${getSoundButton("quick-tool-button", "soundIconCompact", "soundLineCompact")}
        ${getIconButton("quick-tool-button game-only-tool", "mobileControls.toggleFullscreen()", "./assets/img/8_coin/fullscreen.png", "Vollbild")}
        ${getIconButton("quick-tool-button", "openDialogFromMenu('imprintDialog')", "./assets/img/8_coin/info.png", "Info")}
        ${getIconButton("quick-tool-button", "openDialogFromMenu('instructionDialog')", "./assets/img/questioning.png", "Hilfe")}
      </div>
    </div>
  `;
}

function getIconButton(buttonClass, clickAction, imagePath, imageAlt, buttonId = "") {
  return `
    <button${buttonId ? ` id="${buttonId}"` : ""} class="${buttonClass}" onclick="${clickAction}">
      <img src="${imagePath}" alt="${imageAlt}">
    </button>
  `;
}

function getSoundButton(buttonClass, iconId, lineId) {
  return `
    <button class="${buttonClass} sound-control-button game-only-tool" onclick="switchAudioMode()">
      <img id="${iconId}" src="./assets/img/8_coin/audio.png" alt="Ton">
      <span id="${lineId}" class="sound-cross-line sound-line-hidden"></span>
    </button>
  `;
}

function getStartButtonTemplate() {
  return `
    <div id="launchPanel" class="launch-panel">
      ${getStartGameButton()}
      ${getPlayAgainButton()}
    </div>
  `;
}

function getStartGameButton() {
  return `
    <button id="startGameButton" class="launch-button" type="button">
      Spiel starten
    </button>
  `;
}

function getPlayAgainButton() {
  return `
    <button id="playAgainButton" class="launch-button" type="button" onclick="restartRoundDirectly()" style="display: none;">
      Erneut Spielen
    </button>
  `;
}

function getBottomButtonsTemplate() {
  return `
    <div id="footerActionRow" class="footer-action-row wide-screen-tools">
      ${getFooterButton("openDialog('imprintDialog')", "Impressum")}
      ${getFooterButton("openDialog('instructionDialog')", "Spielübersicht")}
    </div>
  `;
}

function getFooterButton(clickAction, label) {
  return `
    <button class="footer-action-button" type="button" onclick="${clickAction}">
      ${label}
    </button>
  `;
}