export default function ShooterStatisPage(props: { params: { id: any } }) {
    return (
        <div>
            <h1>statis: {props.params.id}</h1>
        </div>
    )
}