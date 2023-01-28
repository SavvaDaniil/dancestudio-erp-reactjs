
import { Component } from "react"
import { Button, Modal } from "react-bootstrap";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import PurchaseAbonementService from "../../service/PurchaseAbonementService";


export default class PurchaseAbonementDeleteModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            purchaseAbonementService : new PurchaseAbonementService(),
            isLoading : false,
            isError : false,

            modalPurchaseAbonementDeleteIsShowing : false,
            purchase_abonement_id: 0,
            purchase_abonement_name : "",
        }
        this.modalPurchaseAbonementDeleteOpen = this.modalPurchaseAbonementDeleteOpen.bind(this);
        this.modalPurchaseAbonementDeleteClose = this.modalPurchaseAbonementDeleteClose.bind(this);
        this.prepare = this.prepare.bind(this);
        this.purchaseAbonementDelete = this.purchaseAbonementDelete.bind(this);
    }

    modalPurchaseAbonementDeleteOpen(){
        this.setState({
            modalPurchaseAbonementDeleteIsShowing : true
        });
    }

    modalPurchaseAbonementDeleteClose(){
        this.setState({
            modalPurchaseAbonementDeleteIsShowing : false
        });
    }

    prepare(
        purchase_abonement_id,
        purchase_abonement_name
    ){
        this.setState({
            purchase_abonement_id : purchase_abonement_id,
            purchase_abonement_name : purchase_abonement_name,
        }, function(){
            this.modalPurchaseAbonementDeleteOpen();
        });
    }

    async purchaseAbonementDelete(){
        this.setState({
            isLoading : true, 
            isError : false,
        });

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.purchaseAbonementService.delete(
            jwt, 
            this.state.purchase_abonement_id
        );
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" ){
            this.modalPurchaseAbonementDeleteClose();
            this.props.modalPurchaseAbonementDeleteSuccessCallback();
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    render(){
        return (
            <Modal
                show={this.state.modalPurchaseAbonementDeleteIsShowing}
                onHide={this.modalPurchaseAbonementDeleteClose}
                animation={false}
                size="lg"
                >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Возврат покупки "{this.state.purchase_abonement_name}"
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Вы уверены, что хотите осуществить удалить покупку клиента?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.purchaseAbonementDelete} disabled={this.state.isLoading}>
                        Удалить покупку
                    </Button>
                    <Button variant="secondary" onClick={this.modalPurchaseAbonementDeleteClose}>
                        Закрыть окно
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}