import InstanceHWSpecs from "./instance_hw_specs"
import IPv4Specs from "./ipv4_specs"


const HardwareNetwrokSpecs = ({ values, setValues, isSubmitting, setSubmitting, labs, ...props }) => {

    return (
        <>
            <InstanceHWSpecs values={values} setValues={setValues} />
            <IPv4Specs values={values} setValues={setValues} labs={labs}  isSubmitting={isSubmitting} setSubmitting={setSubmitting} {...props} />
        </>
    )
}

export default HardwareNetwrokSpecs