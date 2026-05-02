type IconName = 'gift' | 'spark' | 'copy' | 'open' | 'search' | 'shuffle' | 'image'

export function Icon({ name }: { name: IconName }) {
  const paths = {
    gift: (
      <>
        <path d="M20 11v9a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 20v-9" />
        <path d="M3 7.5h18v3.7H3z" />
        <path d="M12 7.5v14.3" />
        <path d="M12 7.5c-2.7 0-5.2-.7-5.2-2.6 0-1.2.9-2.1 2.1-2.1 1.9 0 3.1 2.4 3.1 4.7Z" />
        <path d="M12 7.5c2.7 0 5.2-.7 5.2-2.6 0-1.2-.9-2.1-2.1-2.1-1.9 0-3.1 2.4-3.1 4.7Z" />
      </>
    ),
    spark: (
      <>
        <path d="m12 2 1.5 6.1L19 11l-5.5 2.9L12 20l-1.5-6.1L5 11l5.5-2.9L12 2Z" />
        <path d="m5 3 .6 2.4L8 6l-2.4.6L5 9l-.6-2.4L2 6l2.4-.6L5 3Z" />
        <path d="m19 15 .6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6L19 15Z" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M4 15.5V5.8C4 4.8 4.8 4 5.8 4h9.7" />
      </>
    ),
    open: (
      <>
        <path d="M14 4h6v6" />
        <path d="m10 14 10-10" />
        <path d="M20 14v4.2a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18.2V5.8A1.8 1.8 0 0 1 5.8 4H10" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4.1-4.1" />
      </>
    ),
    shuffle: (
      <>
        <path d="M3 7h3.5c2.3 0 3.7 1 5.2 3.2l.6.8c1.5 2.2 2.9 3.2 5.2 3.2H21" />
        <path d="m18 11 3 3-3 3" />
        <path d="M3 17h3.5c1.8 0 3.1-.7 4.2-2" />
        <path d="m18 4 3 3-3 3" />
        <path d="M3 7h3.5c1.8 0 3.1.7 4.2 2" />
      </>
    ),
    image: (
      <>
        <rect x="3.5" y="5" width="17" height="14" rx="2" />
        <path d="m7 15 3.1-3.1a1.2 1.2 0 0 1 1.7 0L15 15" />
        <path d="m13.8 13.8 1.2-1.2a1.2 1.2 0 0 1 1.7 0L20.5 16" />
        <circle cx="8.5" cy="9" r="1.1" />
      </>
    ),
  }

  return (
    <svg className="ui-icon" viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
