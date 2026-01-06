import { useMemo } from 'react'

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  const safeCurrent = Math.min(Math.max(Number(currentPage) || 1, 1), Math.max(Number(totalPages) || 1, 1))
  const safeTotal = Math.max(Number(totalPages) || 1, 1)

  const pages = useMemo(() => {
    if (safeTotal <= 7) return Array.from({ length: safeTotal }, (_, i) => i + 1)

    const set = new Set([1, safeTotal, safeCurrent - 1, safeCurrent, safeCurrent + 1])
    const list = Array.from(set)
      .filter((p) => p >= 1 && p <= safeTotal)
      .sort((a, b) => a - b)

    const out = []
    let prev = 0
    list.forEach((p) => {
      if (prev && p - prev > 1) out.push('ellipsis')
      out.push(p)
      prev = p
    })
    return out
  }, [safeCurrent, safeTotal])

  const canPrev = safeCurrent > 1
  const canNext = safeCurrent < safeTotal

  return (
    <nav aria-label="Pagination">
      <ul className="pagination justify-content-center mb-0">
        <li className={`page-item ${!canPrev ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => canPrev && onPageChange?.(safeCurrent - 1)}
            disabled={!canPrev}
          >
            Previous
          </button>
        </li>

        {pages.map((p, idx) => {
          if (p === 'ellipsis') {
            return (
              <li key={`e-${idx}`} className="page-item disabled">
                <span className="page-link">…</span>
              </li>
            )
          }

          const pageNum = Number(p)
          const active = pageNum === safeCurrent
          return (
            <li key={pageNum} className={`page-item ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}>
              <button type="button" className="page-link" onClick={() => onPageChange?.(pageNum)}>
                {pageNum}
              </button>
            </li>
          )
        })}

        <li className={`page-item ${!canNext ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => canNext && onPageChange?.(safeCurrent + 1)}
            disabled={!canNext}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  )
}
