import React, {Component} from "react";
import {Button, Form, Table} from 'react-bootstrap';

import constant from "../../utils/GlobalValues";
//import TeacherRateTr from "./TeacherRateTr";
import defaultPoster from "../../assets/images/user.png";
import TeacherService from "../../service/TeacherService";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import TeacherRateLiteRow from "../TeacherRate/TeacherRateLiteRow";
import TeacherRateService from "../../service/TeacherRateService";



export default class TeacherEdit extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading : false,

            id : props.id,
            //teacherModel : props.teacherModel,
            //teacherPhotoSrc : props.teacherPhotoSrc,

            //teacherPhotoFile : null,
            //teacherRateList : props.teacherRateList
            name : props.name,
            
            poster_src : props.poster_src,
            stavka : parseInt(props.stavka, 10),
            min_students : parseInt(props.min_students, 10),
            raz : parseInt(props.raz, 10),
            usual : parseInt(props.usual, 10),
            unlim : parseInt(props.unlim, 10),
            stavka_plus : parseInt(props.stavka_plus, 10),
            plus_after_students : parseInt(props.plus_after_students, 10),
            plus_after_summa : parseInt(props.plus_after_summa, 10),
            procent : parseInt(props.procent, 10),
            //teacherRateLiteViewModels : props.teacherRateLiteViewModels,

            warningSave : "",
            successSave : "",
            warningUploadPoster : "",
            teacherPosterFile : null,

            teacherService : new TeacherService(),
            teacherRateService : new TeacherRateService()
        }

        this.teacherFormListener = this.teacherFormListener.bind(this);

        this.clearWarningSave = this.clearWarningSave.bind(this);
        this.clearWarningUploadPoster = this.clearWarningUploadPoster.bind(this);
        this.uploadTeacherPhoto = this.uploadTeacherPhoto.bind(this);
        this.deleteTeacherPoster = this.deleteTeacherPoster.bind(this);
        this.prepareTeacherPhotoFile = this.prepareTeacherPhotoFile.bind(this);
        this.save = this.save.bind(this);

        this.addNewTeacherRate = this.addNewTeacherRate.bind(this);
        this.deleteTeacherRate = this.deleteTeacherRate.bind(this);
        this.saveTeacherRate = this.saveTeacherRate.bind(this);


    }

    clearWarningSave(){
        this.setState({
            warningSave : "",
            successSave : ""
        });
    }
    clearWarningUploadPoster(){
        this.setState({warningUploadPoster : ""});
    }

    teacherFormListener(e){
        this.clearWarningSave();
        switch(e.target.name){
            case "name":
                this.setState({name : e.target.value});
                break;
            case "stavka":
                this.setState({stavka : parseInt(e.target.value, 10)});
                break;
            case "stavka_plus":
                this.setState({stavka_plus : parseInt(e.target.value, 10)});
                break;
            case "plus_after_students":
                this.setState({plus_after_students : parseInt(e.target.value, 10)});
                break;
            case "plus_after_summa":
                this.setState({plus_after_summa : parseInt(e.target.value, 10)});
                break;
            case "procent":
                this.setState({procent : parseInt(e.target.value, 10)});
                break;
            case "min_students":
                this.setState({min_students : parseInt(e.target.value, 10)});
                break;
            case "raz":
                this.setState({raz : parseInt(e.target.value, 10)});
                break;
            case "usual":
                this.setState({usual : parseInt(e.target.value, 10)});
                break;
            case "unlim":
                this.setState({unlim : parseInt(e.target.value, 10)});
                break;
            default:
                break;
        }
    }

    async save(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        this.setState({
            isLoading : true
        });

        const jsonAnswerStatus = await this.state.teacherService.update(
            jwt,
            this.state.id,
            this.state.name,
            this.state.stavka,
            this.state.min_students,
            this.state.raz,
            this.state.usual,
            this.state.unlim,
            this.state.stavka_plus,
            this.state.plus_after_students,
            this.state.plus_after_summa,
            this.state.procent
        );
        if(jsonAnswerStatus.status === "success"){
            this.setState({
                successSave : "Успешно сохранено"
            });
        } else {
            alert("Неизвестная ошибка на сервере");
        }
        this.setState({
            isLoading : false
        });
    }


    prepareTeacherPhotoFile(event){
        this.clearWarningUploadPoster();
        this.setState({
            teacherPosterFile : event.target.files[0]
        });
    }

    async uploadTeacherPhoto(){
        this.clearWarningUploadPoster();
        if(this.state.teacherPosterFile === null){
            this.setState({
                warningUploadPoster : "Файл не указан"
            });
            return;
        }
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        this.setState({
            isLoading : true
        });
        
        const jsonAnswerStatus = await this.state.teacherService.posterUpload(jwt, this.props.id, this.state.teacherPosterFile);
        if(jsonAnswerStatus.status === "success"){
            this.setState({
                successSave : "Успешно сохранено"
            });
            this.props.refresh(this.props.id);
        } else {
            alert("Неизвестная ошибка на сервере");
        }
        this.setState({
            isLoading : false
        });
    }
    async deleteTeacherPoster(){
        this.clearWarningUploadPoster();
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        this.setState({
            isLoading : true
        });
        
        const jsonAnswerStatus = await this.state.teacherService.posterDelete(jwt, this.props.id);
        if(jsonAnswerStatus.status === "success"){
            this.setState({
                successSave : "Успешно сохранено"
            });
            this.props.refresh(this.props.id);
        } else {
            alert("Неизвестная ошибка на сервере");
        }
        this.setState({ isLoading : false });
    }




    async addNewTeacherRate(){
        this.setState({ isLoading : true });
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.teacherRateService.add(jwt, this.props.id);
        
        if(jsonAnswerStatus.status === "success"){
            this.props.refresh(this.props.id);
        } else {
            alert("Неизвестная ошибка на сервере");
        }
        this.setState({ isLoading : false });
    }

    async deleteTeacherRate(teacher_rate_id){
        this.setState({ isLoading : true });
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.teacherRateService.delete(jwt, teacher_rate_id);
        
        if(jsonAnswerStatus.status === "success"){
            this.props.refresh(this.props.id);
        } else {
            alert("Неизвестная ошибка на сервере");
        }
        this.setState({ isLoading : false });
    }

    saveTeacherRate(e, teacher_rate_id){

        clearTimeout(this.timeoutSaveTeacherRate);

        this.timeoutSaveTeacherRate = setTimeout(async() => {
            this.setState({ isLoading : true });
            const adminMiddleWare = new AdminMiddleWare();
            const jwt = adminMiddleWare.getJWTFromCookie();
    
            const jsonAnswerStatus = await this.state.teacherRateService.update(jwt, teacher_rate_id, e.target.name, e.target.value);
            console.log("jsonAnswerStatus.status: " + jsonAnswerStatus.status);
            if(jsonAnswerStatus.status === "success"){
                this.props.refresh(this.props.id);
            } else {
                alert("Неизвестная ошибка на сервере");
            }
            this.setState({ isLoading : false });
        }, 1500);

    }



    render(){
        //console.log("this.state.stavka: " + this.state.stavka);

        var teacherPhotoSrc = defaultPoster;
        if(this.props.poster_src !== null)teacherPhotoSrc = constant.baseDomain + "/" + this.props.poster_src;

        var btndeleteTeacherPoster = "";
        if(this.props.poster_src !== null)btndeleteTeacherPoster = <Button variant="danger" size="sm" onClick={this.deleteTeacherPoster} disabled={this.state.isLoading}>Удалить</Button>


        var rateTable = <center><i>Ставок не найдено</i></center>;
        if(this.props.teacherRateLiteViewModels.length !== 0){
            const rateLiteList = this.props.teacherRateLiteViewModels.map((content, index) => {
                return <TeacherRateLiteRow
                    key={index}
                    id={content.id}
                    students={content.students}
                    price={content.price}

                    isLoading={this.state.isLoading}
                    deleteTeacherRate={this.deleteTeacherRate}
                    saveTeacherRate = {this.saveTeacherRate}
                />
            })

            rateTable = <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            Клиентов
                        </th>
                        <th>
                          Зарплата
                        </th>
                        <th>
                          
                        </th>
                    </tr>
                </thead>
                <tbody>
                  {rateLiteList}
                </tbody>
            </Table>
        }

        
        return(
            <div className="modalEditTeacher">
                <Form>
                    <Form.Group controlId="formFio">
                        <Form.Label>ФИО</Form.Label>
                        <Form.Control type="text" name="name" placeholder="ФИО" maxLength="216" defaultValue={this.props.name} 
                        onChange={this.teacherFormListener} />
                        <Form.Text className="text-muted">
                            
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formPhoto" className="photo">
                        <Form.Label>Фотография преподавателя</Form.Label>
                        <br />
                        <img src={teacherPhotoSrc} alt="teacher poster" className="img-fluid" />
                        <br />
                        {btndeleteTeacherPoster}
                        <br />
                        <Form.Control type="file" accept="image/*,image/jpeg,image/jpg,image/png,image/gif,image/bmp"
                        onChange={this.prepareTeacherPhotoFile} />
                        <Form.Text className="text-muted">{this.state.warningUploadPoster}</Form.Text>
                        <Button variant="success" size="sm" onClick={this.uploadTeacherPhoto} disabled={this.state.isLoading}>Загрузить</Button>
                    </Form.Group>

                </Form>
                
                <Form>
                    <Form.Group controlId="formStavkaCount">
                        <Form.Label>Включить увеличение ставки по количеству:</Form.Label>
                        <Form.Control as="select" name="stavka_plus" defaultValue={this.props.stavka_plus}
                        onChange={this.teacherFormListener}>
                            <option value="0">Выключено</option>
                            <option value="1">Включено</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formStavkaCountPlusAfter">
                        <Form.Label>Количество, начиная (не включая) с которого идёт увеличение ставки:</Form.Label>
                        <Form.Control name="plus_after_students" type="number" maxLength="216" defaultValue={this.props.plus_after_students} 
                        onChange={this.teacherFormListener}
                        />
                    </Form.Group>

                    <Form.Group controlId="formStavkaCountplusAfterSumma">
                        <Form.Label>На какую сумму увеличивать ставку при каждом +1 ученике:</Form.Label>
                        <Form.Control name="plus_after_summa" type="number" maxLength="216" defaultValue={this.props.plus_after_summa} 
                        onChange={this.teacherFormListener}
                        />
                    </Form.Group>

                    <hr />
                    
                    <Form.Group controlId="formStavkaCount">
                        <Form.Label>Ставка:</Form.Label>
                        <Form.Control as="select" name="stavka" defaultValue={this.props.stavka}
                        onChange={this.teacherFormListener}>
                            <option value="0">Обычная по количеству</option>
                            <option value="1">По процентам</option>
                            <option value="2">В зависимости от покупки</option>
                        </Form.Control>
                    </Form.Group>

                    <div className={this.state.stavka === 1 ? "" : "hide"}>
                        <p><i><b>Ставка по процентам:</b></i></p>
                        <Form.Group controlId="formStavkaProcent">
                            <Form.Label><i>Процент преподавателя %(целое число)</i></Form.Label>
                            <Form.Control name="procent" type="number" max="99" defaultValue={this.props.procent}
                            onChange={this.teacherFormListener} 
                            />
                        </Form.Group>
                    </div>

                    <div className={this.state.stavka === 2 ? "" : "hide"}>
                        <p><i><b>Ставка в зависимости от покупки:</b></i></p>
                        <Form.Group controlId="formStavkaByCountStudents">
                            <Form.Label><i>Минимальное количество человек</i></Form.Label>
                            <Form.Control name="min_students" type="number" max="99" defaultValue={this.props.min_students} 
                            onChange={this.teacherFormListener}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><i>За каждое разовое</i></Form.Label>
                            <Form.Control name="raz" type="number" max="99" defaultValue={this.props.raz}
                            onChange={this.teacherFormListener} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><i>За каждый ограниченный абонемент</i></Form.Label>
                            <Form.Control name="usual" type="number" max="99" defaultValue={this.props.usual}
                            onChange={this.teacherFormListener} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><i>За каждый безлимитный абонемент</i></Form.Label>
                            <Form.Control name="unlim" type="number" max="99" defaultValue={this.props.unlim}
                            onChange={this.teacherFormListener} />
                        </Form.Group>
                    </div>

                    <div className={this.state.stavka === 0 ? "" : "hide"}>
                        <p><i><b>Ставка обычная по количеству:</b><br />
                        Таблица работает следующим образом: клиентов - с КАКОГО количества человек зарлпта станет равна тому числу, 
                        что во второй колонке. Например:<br />
                        - до 3-ех человек - 500 рублей, значит пишется "1 500". То есть, как только хотя бы один человек в группе появится, 
                        значит 500 рублей<br />
                        - до 3-ех человек - 500 рублей, 3-7 - 700 рублей. Значит будет следующие строки: "1 500", и "3 700". 
                        То есть, начиная с 1 человека платить преподу нужно 500 рублей, а начиная с 3-ех человек, нужно платить ему 700 рублей</i></p>
                        <Button cariant="secondary" size="sm" onClick={this.addNewTeacherRate} disabled={this.state.isLoading}>
                            Добавить
                        </Button>
                        
                        {rateTable}
                    </div>

                    <hr />
                </Form>


                <Button variant="success" onClick={this.save} disabled={this.state.isLoading}>
                    Сохранить
                </Button>
                <p className="success">{this.state.successSave}</p>
                <p className="warning">{this.state.warningSave}</p>
            </div>
        )
        
    }
}



