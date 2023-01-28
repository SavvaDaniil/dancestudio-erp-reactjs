
import { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import AbonementService from "../../service/AbonementService";
import PurchaseAbonementNewModalBody from "./PurchaseAbonementNewModalBody";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";
import PurchaseAbonementService from "../../service/PurchaseAbonementService";


export default class PurchaseAbonementNewModal extends Component {


    constructor(props){
        super(props);
        this.state = {
            abonementService : new AbonementService(),
            purchaseAbonementService : new PurchaseAbonementService(),
            isLoading : false,
            isError : false,
            isSuccess : false,

            modalPurchaseAbonementNewIsShowing : false,
            user_id : 0,
            abonement_id : 0,
            dance_group_id : 0,
            date_of_buy : "",

            purchaseAbonementNewName : "",
            purchaseAbonementNewSpecialStatus : 0,
            purchaseAbonementNewPrice : 0,
            purchaseAbonementNewCashless : 0,
            purchaseAbonementNewVisits : 0,
            purchaseAbonementNewDays : 0,
            purchaseAbonementNewComment : "",
        }
        this.getForBuy = this.getForBuy.bind(this);
        this.formEditAbonementBuyListener = this.formEditAbonementBuyListener.bind(this);
        this.purchaseAbonementNewInit = this.purchaseAbonementNewInit.bind(this);
        this.modalPurchaseAbonementNewOpen = this.modalPurchaseAbonementNewOpen.bind(this);
        this.modalPurchaseAbonementNewClose = this.modalPurchaseAbonementNewClose.bind(this);
    }

    modalPurchaseAbonementNewOpen(){
        this.setState({
            modalPurchaseAbonementNewIsShowing : true
        });
    }

    modalPurchaseAbonementNewClose(){
        this.setState({
            modalPurchaseAbonementNewIsShowing : false
        });
    }

    async getForBuy(user_id, abonement_id, dance_group_id, date_of_buy){
        
        this.setState({
            user_id : user_id,
            abonement_id : abonement_id, 
            dance_group_id : dance_group_id, 
            date_of_buy : date_of_buy, 
            isLoading : true, 
            isError : false,
            isSuccess : false
        }, function(){
            this.modalPurchaseAbonementNewOpen()
        });

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.abonementService.getForBuy(jwt, abonement_id);
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.abonementForBuyViewModel !== null){
            this.setState({
                purchaseAbonementNewName : jsonAnswerStatus.abonementForBuyViewModel.name,
                purchaseAbonementNewSpecialStatus : jsonAnswerStatus.abonementForBuyViewModel.special_status,
                purchaseAbonementNewPrice : jsonAnswerStatus.abonementForBuyViewModel.price,
                purchaseAbonementNewCashless : 0,
                purchaseAbonementNewVisits : jsonAnswerStatus.abonementForBuyViewModel.visits,
                purchaseAbonementNewDays : jsonAnswerStatus.abonementForBuyViewModel.days,
                purchaseAbonementNewComment : ""
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    formEditAbonementBuyListener(e){
        switch(e.target.name){
            case "price":
                this.setState({purchaseAbonementNewPrice : e.target.value});
                break;
            case "cashless":
                this.setState({purchaseAbonementNewCashless : e.target.value});
                break;
            case "visits":
                this.setState({purchaseAbonementNewVisits : e.target.value});
                break;
            case "days":
                this.setState({purchaseAbonementNewDays : e.target.value});
                break;
            case "comment":
                this.setState({purchaseAbonementNewComment : e.target.value});
                break;
            default:
                break;
        }
    }

    async purchaseAbonementNewInit(){
        this.setState({isLoading : true, isError : false});

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        console.log("this.state.user_id: " + this.state.user_id);
        const jsonAnswerStatus = await this.state.purchaseAbonementService.add(
            jwt, 
            this.state.user_id,
            this.state.abonement_id,
            this.state.dance_group_id,
            this.state.purchaseAbonementNewPrice,
            this.state.purchaseAbonementNewCashless,
            this.state.purchaseAbonementNewVisits,
            this.state.purchaseAbonementNewDays,
            this.state.purchaseAbonementNewComment,
            this.state.date_of_buy
        );
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.abonementForBuyViewModel !== null){
            this.setState({
                isSuccess : true
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    render(){

        let purchaseAbonementNewModalBody = "";
        if(this.state.isLoading){
            purchaseAbonementNewModalBody = <SystemLoadingPage />;
        } else if(this.state.isError){
            purchaseAbonementNewModalBody = <SystemErrorPage tryAgain={() => this.getForBuy(this.state.user_id, this.state.abonement_id)} />;
        } else if(this.state.isSuccess){
            purchaseAbonementNewModalBody = 
            <div className="row system-success">
                <div className="col-4 d-none d-md-block"></div>
                <div className="col-12 col-lg-4 col-md-4">
                    <p>Запрос успешно выполнен</p>
                </div>
            </div>
        } else {
            purchaseAbonementNewModalBody = <PurchaseAbonementNewModalBody
                special_status={this.state.purchaseAbonementNewSpecialStatus}
                price={this.state.purchaseAbonementNewPrice}
                cashless={this.state.purchaseAbonementNewCashless}
                visits={this.state.purchaseAbonementNewVisits}
                days={this.state.purchaseAbonementNewDays}
                comment={this.state.purchaseAbonementNewComment}
                formEditAbonementBuyListener={this.formEditAbonementBuyListener}
            />
        }

        return (
            <Modal
                show={this.state.modalPurchaseAbonementNewIsShowing}
                onHide={this.modalPurchaseAbonementNewClose}
                animation={false}
                size="lg"
                >
                <Modal.Header closeButton>
                    <Modal.Title className={this.state.isLoading ? "hide" : ""}>
                        Оформление покупки "{this.state.purchaseAbonementNewName}"
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {purchaseAbonementNewModalBody}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="info" onClick={this.purchaseAbonementNewInit} className={this.state.isSuccess ? "hide" : ""}>
                        Купить
                    </Button>
                    <Button variant="secondary" onClick={this.modalPurchaseAbonementNewClose}>
                        Закрыть окно
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}