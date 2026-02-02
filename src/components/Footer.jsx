export default function Footer() {
  return (
    <footer className="border-top mt-auto">
      <div className="container py-3">
        <div className="row align-items-center g-3">
          <div className="col-12 col-md">
            <div className="text-secondary" style={{ fontSize: 14 }}>
              123 Avenue Example, 10000 City, Country
            </div>
          </div>
          <div className="col-12 col-md-auto">
            <div className="d-flex gap-3">
              <a className="text-secondary" href="#" aria-label="Twitter">
                <i className="bi bi-twitter-x" />
              </a>
              <a className="text-secondary" href="#" aria-label="GitHub">
                <i className="bi bi-github" />
              </a>
              <a className="text-secondary" href="#" aria-label="LinkedIn">
                <i className="bi bi-linkedin" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
