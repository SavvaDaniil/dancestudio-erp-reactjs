
export default function UserAbonementsForBuyingSubview(props){

    let razLites = "";

    if(typeof(props.abonementLiteViewModels) === "undefined" || props.abonementLiteViewModels === null)return <></>;

    let dance_group_id = (typeof(props.dance_group_id) !== "undefined" && props.dance_group_id !== null ? props.dance_group_id : 0);

    if(props.abonementLiteViewModels.length > 0){
        const razViewModels = props.abonementLiteViewModels.filter((abonementLiteViewModel) => abonementLiteViewModel.special_status === "raz").sort((a, b) => a.name.localeCompare(b.name));
        razLites = razViewModels.map((abonementLiteViewModel) => {
            return <div key={abonementLiteViewModel.id} className="abonement-for-buying">
                <button type="button" className="btn btn-secondary"
                onClick={() => props.purchaseAbonementNewPrepareCallback(props.user_id, abonementLiteViewModel.id, dance_group_id, props.date_of_action)}
                >Оформить покупку</button> - {abonementLiteViewModel.name} {abonementLiteViewModel.price} руб.
            </div>
        });
    }

    let usualLites = "";
    if(props.abonementLiteViewModels.length > 0){
        const usualViewModels = props.abonementLiteViewModels.filter((abonementLiteViewModel) => abonementLiteViewModel.special_status === "usual").sort((a, b) => a.name.localeCompare(b.name));
        usualLites = usualViewModels.map((abonementLiteViewModel) => {
            return <div key={abonementLiteViewModel.id} className="abonement-for-buying">
                <button type="button" className="btn btn-secondary"
                onClick={() => props.purchaseAbonementNewPrepareCallback(props.user_id, abonementLiteViewModel.id, dance_group_id, props.date_of_action)}
                >Оформить покупку</button> - {abonementLiteViewModel.name} {abonementLiteViewModel.price} руб.
            </div>
        });
    }

    let otherLites = "";
    if(props.abonementLiteViewModels.length > 0){
        const otherViewModels = props.abonementLiteViewModels.filter((abonementLiteViewModel) => abonementLiteViewModel.special_status !== "usual" && abonementLiteViewModel.special_status !== "raz").sort((a, b) => a.name.localeCompare(b.name));
        otherLites = otherViewModels.map((abonementLiteViewModel) => {
            return <div key={abonementLiteViewModel.id} className="abonement-for-buying"
            onClick={() => props.purchaseAbonementNewPrepareCallback(props.user_id, abonementLiteViewModel.id, dance_group_id, props.date_of_action)}
            >
                <button type="button" className="btn btn-secondary">Оформить покупку</button> - {abonementLiteViewModel.name} {abonementLiteViewModel.price} руб.
            </div>
        });
    }

    return (
        <div className="subview abonements-for-buying">
            <h6>Разовое</h6>
            {razLites}
            <h6>Абонемент</h6>
            {usualLites}
            <h6>Прочее</h6>
            {otherLites}

        </div>
    )
}