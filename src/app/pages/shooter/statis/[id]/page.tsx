export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'edge'
export const preferredRegion = 'auto'

export default function ShooterStatisPage(props: { params: { id: any } }) {
    return (
        <div>
            <h1>statis: {props.params.id}</h1>
        </div>
    )
}