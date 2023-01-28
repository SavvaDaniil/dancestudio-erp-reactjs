import { Component } from "react";
import { Form } from "react-bootstrap";

export default class AbonementInfoRow extends Component
{
    constructor(props){
        super(props)
        this.state = {
            id : props.id,
            name : props.name,
            special_status : props.special_status,
            days : props.days,
            price : props.price,
            visits : props.visits,
            status_of_visible : props.status_of_visible,
            status_for_app : props.status_for_app,
            is_private : props.is_private,
            is_trial : props.is_trial,

            isLoading : false
        }
        this.inputHandle = this.inputHandle.bind(this);
        this.update = this.update.bind(this);
        this.loadingFinishCallback = this.loadingFinishCallback.bind(this);
    }

    //const [name, setName] = useState();//setName(props.name);
    /*
    const [days, setDays] = useState();setDays(props.days);
    const [price, setPrice] = useState();setPrice(props.price);
    const [visits, setVisits] = useState();setVisits(props.visits);
    const [status_of_visible, setStatusOfVisible] = useState();setStatusOfVisible(props.status_of_visible);
    const [status_for_app, setStatusForApp] = useState();setStatusForApp(props.status_for_app);
    const [is_private, setIsPrivate] = useState();setIsPrivate(props.is_private);
    */

    //const nameHandle = (event) => {setName(event.target.value);}

    inputHandle(e){
        switch(e.target.name){
            case "name":
                this.setState({name : e.target.value});
                break;
            case "days":
                this.setState({days : e.target.value});
                break;
            case "price":
                this.setState({price : e.target.value});
                break;
            case "visits":
                this.setState({visits : e.target.value});
                break;
            case "status_of_visible":
                this.setState({status_of_visible : e.target.value});
                break;
            case "status_for_app":
                this.setState({status_for_app : e.target.value});
                break;
            case "is_private":
                this.setState({is_private : e.target.value});
                break;
            default:
                break;
        }
    }

    update(){
        this.setState({
            isLoading : true
        });
        this.props.update(
            this.loadingFinishCallback,

            this.state.id, 
            this.state.name, 
            this.state.days, 
            this.state.price, 
            this.state.visits, 
            this.state.status_of_visible, 
            this.state.status_for_app, 
            this.state.is_private
        )
    }

    loadingFinishCallback(){
        console.log("loadingFinishCallback");
        this.setState({
            isLoading : false
        });
    }


    render(){
        return (
            <tr>
                <td>{this.state.id}</td>
                <td>
                    <Form.Control type="text" name="name" placeholder="Наименование" defaultValue={this.state.name} onChange={this.inputHandle} 
                     />
                </td>
                <td>
                    <Form.Control type="number" name="days" defaultValue={this.state.days} disabled={this.state.special_status === "raz"} onChange={this.inputHandle} />
                </td>
                <td>
                    <Form.Control type="number" name="price" defaultValue={this.state.price} onChange={this.inputHandle} />
                </td>
                <td>
                    <Form.Control type="number" name="visits" defaultValue={this.state.visits} disabled={this.state.special_status === "raz" || this.state.special_status === "unlim"} onChange={this.inputHandle} />
                </td>
                <td>
                    <p>
                    {this.state.special_status === "usual" ? "Абонемент" : this.state.special_status === "unlim" ? "Безлимитка" : this.state.special_status === "raz" ? "Разовое" : ""}
                    </p>
                </td>
                <td>
                    <p>
                    {this.state.is_trial === 1 ? "Да" : "Нет"}
                    </p>
                </td>
                <td></td>
                <td>
                    <Form.Select name="status_of_visible" aria-label="Отображать админам?" defaultValue={this.state.status_of_visible} onChange={this.inputHandle}>
                        <option value={0}>Нет</option>
                        <option value={1}>Да</option>
                    </Form.Select>
                </td>
                <td>
                    <Form.Select name="status_for_app" aria-label="Отображать в приложении?" defaultValue={this.state.status_for_app} onChange={this.inputHandle}>
                        <option value={0}>Нет</option>
                        <option value={1}>Да</option>
                    </Form.Select>
                </td>
                <td>
                    <Form.Select name="is_private" aria-label="Приватно в приложении?" defaultValue={this.state.is_private} onChange={this.inputHandle}>
                        <option value={0}>Нет</option>
                        <option value={1}>Да</option>
                    </Form.Select>
                </td>
                <td>
                    <button type="button" className="btn btn-success btn-sm" onClick={this.update} disabled={this.state.isLoading}>Сохранить</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => this.props.deletePrepare(this.state.id, this.state.name)} disabled={this.state.isLoading}>Удалить</button>
                </td>
            </tr>
        )
    }
}