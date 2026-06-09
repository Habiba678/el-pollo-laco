function getTopBarTemplate() {
  return `
    <div id="gameToolbar" class="game-toolbar">
      <div class="toolbar-desktop-group wide-screen-tools">
        <button class="toolbar-icon-button game-only-tool" onclick="returnToStartScreen()">
          <img src="./assets/img/8_coin/back.png" alt="Zurück">
        </button>

        <button class="toolbar-icon-button sound-control-button game-only-tool" onclick="switchAudioMode()">
          <img id="soundIconDesktop" src="./assets/img/8_coin/audio.png" alt="Ton">
          <span id="soundLineDesktop" class="sound-cross-line sound-line-hidden"></span>
        </button>

        <button class="toolbar-icon-button game-only-tool" onclick="mobileControls.toggleFullscreen()">
          <img src="./assets/img/8_coin/fullscreen.png" alt="Vollbild">
        </button>

        <button id="restartToolbarButton" class="toolbar-icon-button game-only-tool" onclick="restartRoundDirectly()">
          <img src="./assets/img/8_coin/neustart.png" alt="Neustart">
        </button>
      </div>

      <div class="quick-tools-wrap compact-layer">
        <div id="quickToolsPanel" class="quick-tools-panel">
          <button class="quick-tool-button game-only-tool" onclick="returnToStartScreen()">
            <img src="./assets/img/8_coin/back.png" alt="Zurück">
          </button>

          <button class="quick-tool-button sound-control-button game-only-tool" onclick="switchAudioMode()">
            <img id="soundIconCompact" src="./assets/img/8_coin/audio.png" alt="Ton">
            <span id="soundLineCompact" class="sound-cross-line sound-line-hidden"></span>
          </button>

          <button class="quick-tool-button game-only-tool" onclick="mobileControls.toggleFullscreen()">
            <img src="./assets/img/8_coin/fullscreen.png" alt="Vollbild">
          </button>

          <button class="quick-tool-button" onclick="openDialogFromMenu('imprintDialog')">
            <img src="./assets/img/8_coin/info.png" alt="Info">
          </button>

          <button class="quick-tool-button" onclick="openDialogFromMenu('instructionDialog')">
            <img src="./assets/img/questioning.png" alt="Hilfe">
          </button>
        </div>
      </div>
    </div>
  `;
}

function getStartButtonTemplate() {
  return `
    <div id="launchPanel" class="launch-panel">
      <button id="startGameButton" class="launch-button" type="button">
        Spiel starten
      </button>

      <button id="playAgainButton" class="launch-button" type="button" onclick="restartRoundDirectly()" style="display: none;">
        Erneut Spielen
      </button>
    </div>
  `;
}

function getBottomButtonsTemplate() {
  return `
    <div id="footerActionRow" class="footer-action-row wide-screen-tools">
      <button class="footer-action-button" type="button" onclick="openDialog('imprintDialog')">
        Impressum
      </button>

      <button class="footer-action-button" type="button" onclick="openDialog('instructionDialog')">
        Spielhilfe
      </button>
    </div>
  `;
}