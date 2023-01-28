import { Component } from "react"
import VisitService from "../../service/VisitService";
import { Button, Modal } from "react-bootstrap";
import AdminMiddleWare from "../../utils/AdminMiddleware";


export default class VisitDeleteModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            visitService : new VisitService(),
            isLoading : false,
            isError : false,

            modalVisitDeleteIsShowing : false,
            user_id: 0,
            purchase_abonement_id: 0,
            purchase_abonement_name : "",
            visit_id: 0
        }
        this.modalVisitDeleteOpen = this.modalVisitDeleteOpen.bind(this);
        this.modalVisitDeleteClose = this.modalVisitDeleteClose.bind(this);
        this.prepare = this.prepare.bind(this);
        this.visitDelete = this.visitDelete.bind(this);
    }

    modalVisitDeleteOpen(){
        this.setState({
            modalVisitDeleteIsShowing : true
        });
    }

    modalVisitDeleteClose(){
        this.setState({
            modalVisitDeleteIsShowing : false
        });
    }

    prepare(
        user_id,
        visit_id,
        purchase_abonement_id,
        purchase_abonement_name
    ){
        this.setState({
            user_id : user_id,
            visit_id : visit_id,
            purchase_abonement_id : purchase_abonement_id,
            purchase_abonement_name : purchase_abonement_name,
        }, function(){
            this.modalVisitDeleteOpen();
        });
    }

    async visitDelete(){
        this.setState({
            isLoading : true, 
            isError : false,
        });

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.visitService.delete(
            jwt, 
            this.state.visit_id
        );
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" ){
            this.modalVisitDeleteClose();
            this.props.visitDeleteSuccessCallback();
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    render(){
        return (
            <Modal
                show={this.state.modalVisitDeleteIsShowing}
                onHide={this.modalVisitDeleteClose}
                animation={false}
                size="lg"
                >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Удаление визита с "{this.state.purchase_abonement_name}"
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Вы уверены, что хотите осуществить удалить визит клиента?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.visitDelete} disabled={this.state.isLoading}>
                        Удалить визит
                    </Button>
                    <Button variant="secondary" onClick={this.modalVisitDeleteClose}>
                        Закрыть окно
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}