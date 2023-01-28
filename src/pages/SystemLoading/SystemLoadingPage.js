import "./SystemLoadingPage.style.css";

export function SystemLoadingPage() {
    
    return (
        <div className="row system-loading">
            <div className="col-4 d-none d-md-block"></div>
            <div className="col-12 col-lg-4 col-md-4">
                <p>Подождите пожалуйста, идет загрузка...</p>
            </div>
        </div>
    )
}