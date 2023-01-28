import { Component } from "react";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import { Button, Modal } from "react-bootstrap";
import VisitService from "../../service/VisitService";
import VisitNewModalBody from "./VisitNewModalBody";
import DateConverter from "../../utils/DateConverter";


export default class VisitNewModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            visitService : new VisitService(),
            dateConverter : new DateConverter(),
            isLoading : false,
            isError : false,
            isSuccess : false,

            modalVisitNewIsShowing : false,
            user_id : 0,
            dance_group_id : 0,
            purchase_abonement_id : 0,
            date_of_action : new Date(),

            userSecondname : "",
            userFirstname : "",

            danceGroupName : "",

            abonementLiteViewModels : [],
            purchaseAbonementLiteViewModels : [],
            visitLiteViewModels : [],
        }
        this.modalVisitNewOpen = this.modalVisitNewOpen.bind(this);
        this.modalVisitNewClose = this.modalVisitNewClose.bind(this);
        this.visitNew = this.visitNew.bind(this);
        this.visitDeletePrepare = this.visitDeletePrepare.bind(this);
        this.purchaseAbonementNewPrepare = this.purchaseAbonementNewPrepare.bind(this);
        this.purchaseAbonementDeletePrepare = this.purchaseAbonementDeletePrepare.bind(this);
    }

    modalVisitNewOpen(){
        this.setState({
            modalVisitNewIsShowing : true
        });
    }

    modalVisitNewClose(){
        this.setState({
            modalVisitNewIsShowing : false
        });
    }

    async getVisitPrepare(user_id, dance_group_id, date_of_action){
        
        this.setState({
            user_id : user_id,
            dance_group_id : dance_group_id, 
            date_of_action : date_of_action, 
            isLoading : true, 
            isError : false,
            isSuccess : false
        }, function(){
            this.modalVisitNewOpen()
        });

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.visitService.prepare(
            jwt, 
            user_id, 
            dance_group_id, 
            this.state.dateConverter.toStringLikeYmd(date_of_action)
        );
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.visitPrepareViewModel !== null){
            this.setState({
                userSecondname : jsonAnswerStatus.visitPrepareViewModel.userMicroViewModel.secondname,
                userFirstname : jsonAnswerStatus.visitPrepareViewModel.userMicroViewModel.firstname,
                danceGroupName : jsonAnswerStatus.visitPrepareViewModel.danceGroupPreviewViewModel.name,

                abonementLiteViewModels : jsonAnswerStatus.visitPrepareViewModel.abonementLiteViewModels,
                purchaseAbonementLiteViewModels : jsonAnswerStatus.visitPrepareViewModel.purchaseAbonementLiteViewModels,
                visitLiteViewModels : jsonAnswerStatus.visitPrepareViewModel.visitLiteViewModels,
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    purchaseAbonementDeletePrepare(purchaseAbonementId, purchaseAbonementName){
        this.modalVisitNewClose();
        this.props.purchaseAbonementDeletePrepareCallback(purchaseAbonementId, purchaseAbonementName);
    }

    purchaseAbonementNewPrepare(userId, abonementId, danceGroupId, date_of_buy){
        this.modalVisitNewClose();
        this.props.purchaseAbonementNewPrepareCallback(userId, abonementId, danceGroupId, date_of_buy);
    }

    async visitNew(user_id, dance_group_id, purchase_abonement_id, date_of_action){
        this.setState({
            user_id : user_id,
            dance_group_id : dance_group_id, 
            purchase_abonement_id : purchase_abonement_id, 
            date_of_action : date_of_action, 
            isLoading : true, 
            isError : false,
            isSuccess : false
        }, function(){
            this.modalVisitNewOpen()
        });
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.visitService.add(
            jwt, 
            user_id, 
            dance_group_id,
            purchase_abonement_id,
            this.state.dateConverter.toStringLikeYmd(date_of_action)
        );
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success"){
            this.props.visitNewSuccessCallback();
        } else {
            this.setState({
                isError : true
            });
        }
    }

    visitDeletePrepare(visit_id, purchase_abonement_id, purchase_abonement_name){
        this.modalVisitNewClose();
        this.props.visitDeletePrepareCallback(visit_id, purchase_abonement_id, purchase_abonement_name);
    }

    render(){
        return (
            <Modal
                show={this.state.modalVisitNewIsShowing}
                onHide={this.modalVisitNewClose}
                animation={false}
                size="lg"
                className="modal-visit-new"
                >
                <Modal.Header closeButton>
                    <Modal.Title className={this.state.isLoading ? "hide" : ""}>
                        "{this.state.danceGroupName}" для {this.state.userSecondname + ' ' + this.state.userFirstname} 
                        {this.state.date_of_action.getDate() + "." + parseInt(this.state.date_of_action.getMonth() + 1, 10) + "." + this.state.date_of_action.getFullYear()}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <VisitNewModalBody
                    isLoading={this.state.isLoading}
                    isError={this.state.isError}
                    user_id={this.state.user_id}
                    dance_group_id={this.state.dance_group_id}
                    date_of_action={this.state.date_of_action}
                    abonementLiteViewModels={this.state.abonementLiteViewModels}
                    purchaseAbonementLiteViewModels={this.state.purchaseAbonementLiteViewModels}
                    purchaseAbonementNewPrepareCallback={this.purchaseAbonementNewPrepare}
                    visitLiteViewModels={this.state.visitLiteViewModels}
                    visitDeletePrepareCallback={this.visitDeletePrepare}
                    
                    tryAgainCallback={() => this.getVisitPrepare(this.state.user_id, this.state.dance_group_id, this.state.date_of_action)}
                    purchaseAbonementDeletePrepareCallback={this.purchaseAbonementDeletePrepare}
                    visitNewCallback={this.visitNew}
                    />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.modalVisitNewClose}>
                        Закрыть окно
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}