const ModalTemplatePage = ({ RenderedComponent, ...props}) => {


    return (
        <>
            <RenderedComponent {...props} />
        </>
    )
}

export default ModalTemplatePage