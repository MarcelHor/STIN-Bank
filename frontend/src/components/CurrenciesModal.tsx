export const CurrenciesModal = (props: any) => {

    return (
        <div className={`modal ${props.isCurrencyModalOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={() => props.setIsCurrencyModalOpen(false)}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Add currencies</p>
                    <button className="delete" aria-label="close"
                            onClick={() => props.setIsCurrencyModalOpen(false)}></button>
                </header>
                <section className="modal-card-body">

                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success">Add</button>
                    <button className="button" onClick={() => props.setIsModalOpen(false)}>Cancel</button>
                </footer>
            </div>
        </div>
    )
}