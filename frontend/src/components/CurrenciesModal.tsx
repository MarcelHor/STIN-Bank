export const CurrenciesModal = (props: any) => {

    return (
        <div className={`modal ${props.isModalOpen ? 'is-active' : ''}`}>
            <div className="modal-background"/>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Select currencies</p>
                    <button className="delete" aria-label="close" onClick={props.toggleModal}/>
                </header>
            </div>
        </div>
    )
}