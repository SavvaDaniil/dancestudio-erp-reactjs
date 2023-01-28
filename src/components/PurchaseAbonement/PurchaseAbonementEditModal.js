import { Component } from "react";
import PurchaseAbonementService from "../../service/PurchaseAbonementService";
import PurchaseAbonementEditModalBody from "./PurchaseAbonementEditModalBody";
import { Button, Modal } from "react-bootstrap";
import AdminMiddleWare from "../../utils/AdminMiddleware";


export default class PurchaseAbonementEditModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            purchaseAbonementService : new PurchaseAbonementService(),
            isLoading : false,
            isError : false,
            isSaving : false,

            modalPurchaseAbonementEditIsShowing : false,
            user_id : 0,
            purchase_abonement_id : 0,

            purchaseAbonementAbonementLiteViewModel : null,
            purchaseAbonementDateOfBuy : "",
            purchaseAbonementSpecialStatus : "",
            purchaseAbonementDays : 0,
            purchaseAbonementDateOfActivation : "",
            purchaseAbonementDateOfMustBeUsedTo : "",
            purchaseAbonementVisitsStart : 0,
            purchaseAbonementVisitsLeft : 0,
            purchaseAbonementPrice : 0,
            purchaseAbonementCashless : 0,
            purchaseAbonementComment : "",

            warning : "",
            success : "",

        }
        this.modalPurchaseAbonementEditOpen = this.modalPurchaseAbonementEditOpen.bind(this);
        this.modalPurchaseAbonementEditClose = this.modalPurchaseAbonementEditClose.bind(this);
        this.formEditPurchaseAbonementListener = this.formEditPurchaseAbonementListener.bind(this);
        this.getForEdit = this.getForEdit.bind(this);
        this.update = this.update.bind(this);
        this.clearWarning = this.clearWarning.bind(this);
    }

    modalPurchaseAbonementEditOpen(){
        this.setState({
            modalPurchaseAbonementEditIsShowing : true
        });
    }

    modalPurchaseAbonementEditClose(){
        this.setState({
            modalPurchaseAbonementEditIsShowing : false
        });
    }

    formEditPurchaseAbonementListener(e){
        this.clearWarning();
        switch(e.target.name){
            case "date_of_buy":
                this.setState({purchaseAbonementDateOfBuy : e.target.value});
                break;
            case "days":
                this.setState({purchaseAbonementDays : e.target.value});
                break;
            case "date_of_activation":
                this.setState({purchaseAbonementDateOfActivation : e.target.value});
                break;
            case "date_of_must_be_used_to":
                this.setState({purchaseAbonementDateOfMustBeUsedTo : e.target.value});
                break;
            case "visits_start":
                this.setState({purchaseAbonementVisitsStart : e.target.value});
                break;
            case "visits_left":
                this.setState({purchaseAbonementVisitsLeft : e.target.value});
                break;
            case "price":
                this.setState({purchaseAbonementPrice : e.target.value});
                break;
            case "cashless":
                this.setState({purchaseAbonementCashless : e.target.value});
                break;
            case "comment":
                this.setState({purchaseAbonementComment : e.target.value});
                break;
            default:
                break;
        }
    }

    async getForEdit(purchase_abonement_id){
        this.setState({
            isLoading : true,
            isError : false,
            isLaunched : true,
            purchase_abonement_id : purchase_abonement_id,
        }, function(){
            this.modalPurchaseAbonementEditOpen();
        });
        
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.purchaseAbonementService.getForEdit(jwt, purchase_abonement_id);
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.purchaseAbonementLiteViewModel !== null){
            this.setState({
                purchaseAbonementAbonementLiteViewModel : jsonAnswerStatus.purchaseAbonementLiteViewModel.abonementLiteViewModel,
                purchaseAbonementDateOfBuy : jsonAnswerStatus.purchaseAbonementLiteViewModel.date_of_buy,
                purchaseAbonementSpecialStatus : jsonAnswerStatus.purchaseAbonementLiteViewModel.special_status,
                purchaseAbonementDays : jsonAnswerStatus.purchaseAbonementLiteViewModel.days,
                purchaseAbonementDateOfActivation : jsonAnswerStatus.purchaseAbonementLiteViewModel.date_of_activation,
                purchaseAbonementDateOfMustBeUsedTo : jsonAnswerStatus.purchaseAbonementLiteViewModel.date_of_must_be_used_to,
                purchaseAbonementVisitsStart : jsonAnswerStatus.purchaseAbonementLiteViewModel.visits_start,
                purchaseAbonementVisitsLeft : jsonAnswerStatus.purchaseAbonementLiteViewModel.visits_left,
                purchaseAbonementPrice : jsonAnswerStatus.purchaseAbonementLiteViewModel.price,
                purchaseAbonementCashless : jsonAnswerStatus.purchaseAbonementLiteViewModel.cashless,
                purchaseAbonementComment : jsonAnswerStatus.purchaseAbonementLiteViewModel.comment,
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    clearWarning(){
        this.setState({
            warning : "",
            success : ""
        });
    }
    async update(){
        this.clearWarning();
        this.setState({
            isSaving : true,
            isError : false
        });
        
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.purchaseAbonementService.update(
            jwt, 
            this.state.purchase_abonement_id,
            this.state.purchaseAbonementPrice,
            this.state.purchaseAbonementCashless,
            this.state.purchaseAbonementVisitsStart,
            this.state.purchaseAbonementVisitsLeft,
            this.state.purchaseAbonementDays,
            this.state.purchaseAbonementDateOfBuy,
            this.state.purchaseAbonementDateOfActivation,
            this.state.purchaseAbonementDateOfMustBeUsedTo,
            this.state.purchaseAbonementComment
        );
        
        this.setState({isSaving : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.purchaseAbonementLiteViewModel !== null){
            this.setState({
                success : "Успешно сохранено",
            });
        } else {
            this.setState({
                warning : "Неизвестная ошибка на сервере",
            });
        }
    }

    render(){
        return (
            <Modal
                show={this.state.modalPurchaseAbonementEditIsShowing}
                onHide={this.modalPurchaseAbonementEditClose}
                animation={false}
                size="lg"
                >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Редактирование покупки
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <PurchaseAbonementEditModalBody
                        id={this.state.purchase_abonement_id}
                        date_of_buy={this.state.purchaseAbonementDateOfBuy}
                        special_status={this.state.purchaseAbonementSpecialStatus}
                        name={this.state.purchaseAbonementName}
                        days={this.state.purchaseAbonementDays}
                        date_of_activation={this.state.purchaseAbonementDateOfActivation}
                        date_of_must_be_used_to={this.state.purchaseAbonementDateOfMustBeUsedTo}
                        visits_start={this.state.purchaseAbonementVisitsStart}
                        visits_left={this.state.purchaseAbonementVisitsLeft}
                        price={this.state.purchaseAbonementPrice}
                        cashless={this.state.purchaseAbonementCashless}
                        comment={this.state.purchaseAbonementComment}
                        abonementLiteViewModel={this.state.purchaseAbonementAbonementLiteViewModel}

                        formEditPurchaseAbonementListener={this.formEditPurchaseAbonementListener}
                        tryAgain={() => this.getForEdit(this.state.purchase_abonement_id)}
                        isLoading={this.state.isLoading}
                        isError={this.state.isError}
                    />

                    <p className="warning">{this.state.warning}</p>
                    <p className="success">{this.state.success}</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="info" onClick={this.update} disabled={this.state.isSaving || this.state.isLoading}>
                        Сохранить
                    </Button>
                    <Button variant="secondary" onClick={this.modalPurchaseAbonementEditClose}>
                        Закрыть окно
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}