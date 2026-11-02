import { getMeta, getProgress, saveProgress, setMeta } from '../idb-wrapper.js'

// Liga os botões Anterior / Marcar concluído / Próximo de um capítulo.
export async function initChapterControls() {
  const root = document.getElementById('chapter-root')
  if (!root) return

  const chapterId = root.dataset.chapterId
  const chapterIndex = parseInt(root.dataset.chapterIndex || '0', 10)
  const nextButton = document.getElementById('btn-next')
  const markButton = document.getElementById('btn-mark')

  const maxViewed = (await getMeta('maxViewedIndex')) ?? -1
  if (!Number.isNaN(chapterIndex) && chapterIndex > maxViewed + 1 && nextButton) {
    nextButton.disabled = true
  }

  const progress = await getProgress(chapterId)
  if (progress?.completed && nextButton && nextButton.dataset.hasNext !== 'false') {
    nextButton.disabled = false
  }

  async function markComplete() {
    await saveProgress(chapterId, { viewed: 1, completed: 1, updated_at: new Date().toISOString() })

    const currentMax = (await getMeta('maxViewedIndex')) ?? -1
    if (!Number.isNaN(chapterIndex) && chapterIndex > currentMax) {
      await setMeta('maxViewedIndex', chapterIndex)
    }
    if (nextButton && nextButton.dataset.hasNext !== 'false') nextButton.disabled = false

    try {
      const token = localStorage.getItem('jwt')
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ chapter_id: chapterId, viewed: 1, completed: 1 }),
      })
    } catch (error) {
      console.warn('Não foi possível sincronizar o progresso:', error)
    }
  }

  markButton?.addEventListener('click', markComplete)
}
