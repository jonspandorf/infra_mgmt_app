import ResourcesTable from '../components/products-table'

const ShowTables = ({ items, title, ...props}) => {

    return (
        <>
            <h1>{title}</h1>
            <ResourcesTable 
                resources={items.slice(0,2)} 
                resourcesLength={items.length} 
                {...props} 
            />
        </>
    )
}

export default ShowTables

