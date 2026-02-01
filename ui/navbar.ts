import type { NavbarOptions } from '../core/types'

export function initNavbar({
  leftPanel,
  rightPanel,
  leftPanelToggle,
  rightPanelToggle,
  leftPanelClose,
  rightPanelClose,
  toolButtons,
  onToolSelect
}: NavbarOptions) {
  function toggleLeftPanel() {
    leftPanel.classList.toggle('collapsed')
    leftPanelToggle.classList.toggle(
      'active',
      !leftPanel.classList.contains('collapsed')
    )
  }

  function toggleRightPanel() {
    rightPanel.classList.toggle('collapsed')
    rightPanelToggle.classList.toggle(
      'active',
      !rightPanel.classList.contains('collapsed')
    )
  }

  leftPanelToggle.addEventListener('click', toggleLeftPanel)
  rightPanelToggle.addEventListener('click', toggleRightPanel)

  leftPanelClose.addEventListener('click', toggleLeftPanel)
  rightPanelClose.addEventListener('click', toggleRightPanel)

  leftPanelToggle.classList.add('active')
  rightPanelToggle.classList.add('active')

  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tool = btn.dataset.tool
      if (!tool) return

      toolButtons.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      onToolSelect(tool)
    })
  })

  return {
    closeLeft: () => leftPanel.classList.add('collapsed'),
    closeRight: () => rightPanel.classList.add('collapsed'),
    setTool: (toolId: string) => {
      toolButtons.forEach(btn => {
        if (btn.dataset.tool === toolId) {
          btn.classList.add('active')
        } else {
          btn.classList.remove('active')
        }
      })
    }
  }
}

