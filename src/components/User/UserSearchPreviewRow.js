import imgUserDefault from "../../assets/images/user.png";

export default function UserSearchPreviewRow(props){


    return (
        <div className="col-12">
            <div className="user-search-preview" onClick={() => props.getUser(props.id)}>
                <img src={imgUserDefault} className="img-fluid" alt="user-poster" />
                <p>{props.secondname} {props.firstname}</p>
                <ul className="short-info">
                    <li><i className="fa fa-clock-o"></i> Последнее посещение: {props.date_of_last_visit}</li>
                    <li><i className="fa fa-clock-o"></i> Дата регистрации: {props.date_of_add}</li>
                </ul>
                <ul className="line">
                    <li><i className="fa fa-credit-card"></i></li>
                    <li><i className="fa fa-mobile-phone"></i> {props.telephone}</li>
                </ul>
            </div>
        </div>
    )
}