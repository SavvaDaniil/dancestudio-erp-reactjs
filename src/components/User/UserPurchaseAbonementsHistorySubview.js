import React, { Component } from "react";
import { Button, Table } from "react-bootstrap";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";
import PurchaseAbonementService from "../../service/PurchaseAbonementService";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import DateConverter from "../../utils/DateConverter";
import PurchaseAbonementEditModal from "../PurchaseAbonement/PurchaseAbonementEditModal";


export default class UserPurchaseAbonementsHistorySubview extends Component {

    constructor(props){
        super(props);
        this.state = {
            purchaseAbonementService : new PurchaseAbonementService(),

            user_id : 0,
            isLoading : false,
            isError : false,
            isLaunched : false,

            purchaseAbonementLiteViewModels : [],
        }
        this.refPurchaseAbonementEditModal = React.createRef();
    }

    async listAllLitesOfUser(user_id){
        this.setState({
            isLoading : true,
            isError : false,
            isLaunched : true,
            user_id : user_id,
        });
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.purchaseAbonementService.listAllLitesOfUser(jwt, user_id);
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.purchaseAbonementLiteViewModels !== null){
            this.setState({
                purchaseAbonementLiteViewModels : jsonAnswerStatus.purchaseAbonementLiteViewModels
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    render(){

        let purchaseAbonementLitesTable = "";
        const dateConverter = new DateConverter();
        if(this.state.isLoading){
            purchaseAbonementLitesTable = <SystemLoadingPage />
        } else if(this.state.isError){
            purchaseAbonementLitesTable = <SystemErrorPage tryAgain={() => this.listAllLitesOfUser(this.props.user_id)} />
        } else if(this.state.purchaseAbonementLiteViewModels.length === 0 && this.state.isLaunched){
            purchaseAbonementLitesTable = <center><i>- покупок не найдено -</i></center>
        } else if(this.state.purchaseAbonementLiteViewModels.length > 0 && this.state.isLaunched) {

            let purchaseAbonementLiteRows = this.state.purchaseAbonementLiteViewModels.map((purchaseAbonementLiteViewModel) => {

                let abonementLiteViewModel = purchaseAbonementLiteViewModel.abonementLiteViewModel !== null ? purchaseAbonementLiteViewModel.abonementLiteViewModel : null;

                let specialStatusToPrint = "";
                if(abonementLiteViewModel !== null){
                    switch(abonementLiteViewModel.special_status){
                        case "raz":
                            specialStatusToPrint = "Разовое";
                            break;
                        case "usual":
                            specialStatusToPrint = "Абонемент";
                            break;
                        case "unlim":
                            specialStatusToPrint = "Безлимитное";
                            break;
                        default:
                            specialStatusToPrint = "<ошибка>";
                            break;
                    }
                }

                return <tr key={purchaseAbonementLiteViewModel.id}>
                    <td>{purchaseAbonementLiteViewModel.id}</td>
                    <td>{dateConverter.toDateLikedmY(purchaseAbonementLiteViewModel.date_of_buy)}</td>
                    <td>{specialStatusToPrint}</td>
                    <td>{abonementLiteViewModel !== null ? abonementLiteViewModel.name : "<абонемент удален>"}</td>
                    <td>{purchaseAbonementLiteViewModel.days}</td>
                    <td>{purchaseAbonementLiteViewModel.date_of_activation !== null ? dateConverter.toDateLikedmY(purchaseAbonementLiteViewModel.date_of_activation) : "не акт"}</td>
                    <td>{purchaseAbonementLiteViewModel.date_of_must_be_used_to !== null ? dateConverter.toDateLikedmY(purchaseAbonementLiteViewModel.date_of_must_be_used_to) : "не акт"}</td>
                    <td>{purchaseAbonementLiteViewModel.visits_start}</td>
                    <td>{purchaseAbonementLiteViewModel.visits_left}</td>
                    <td>{purchaseAbonementLiteViewModel.price}</td>
                    <td>{purchaseAbonementLiteViewModel.cashless}</td>
                    <td>
                        <Button variant="info" size="sm" onClick={() => this.refPurchaseAbonementEditModal.current.getForEdit(purchaseAbonementLiteViewModel.id)}>
                            Edit
                        </Button>
                    </td>
                </tr>
            });

            purchaseAbonementLitesTable = <Table striped bordered hover>
            <thead>
                <tr>
                    <th>
                        ID
                    </th>
                    <th>
                        Дата покупки
                    </th>
                    <th>
                        Вид абонемента
                    </th>
                    <th>
                        Наименование
                    </th>
                    <th>
                        Дней
                    </th>
                    <th>
                        Дата активации
                    </th>
                    <th>
                        Дата окончания действия
                    </th>
                    <th>
                        На сколько занятий
                    </th>
                    <th>
                        Занятий осталось
                    </th>
                    <th>
                        Наличными
                    </th>
                    <th>
                        Безнал
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {purchaseAbonementLiteRows}
            </tbody>
        </Table>
        }

        return (
            <div className="col-12">
                <Button variant="info" disabled={this.state.isLoading} onClick={() => this.listAllLitesOfUser(this.props.user_id)}>Загрузить историю покупок</Button>

                {purchaseAbonementLitesTable}

                <PurchaseAbonementEditModal
                ref={this.refPurchaseAbonementEditModal}
                />
            </div>
        )
    }
}