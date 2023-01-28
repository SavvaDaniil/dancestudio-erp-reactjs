import { Button } from "react-bootstrap";
import "./SystemErrorPage.style.css";

export function SystemErrorPage(props){
    return (
        <div className="row system-error">
            <div className="col-4 d-none d-md-block"></div>
            <div className="col-12 col-lg-4 col-md-4">
                <p>Извините, на стороне сервера произошла ошибка, либо на сервере идут работы</p>
                <Button variant="primary" type="button" onClick={props.tryAgain}>Еще раз</Button>
            </div>
        </div>
    )
}