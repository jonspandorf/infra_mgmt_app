const os_scripts_path = process.env.OS_SCRIPTS_PATH || '/home/ipam/scripts/'
const os_artifacts_path = process.env.OS_ARTIFACTS_PATH || '/home/ipam/artifacts'
const LocalArtifacts = '/artifacts'
const os_files_path = process.env.OS_FILES_PATH || '/home/ipam/files'
const local_files_path = process.env.LOCAL_FILES_PATH
const os_tf_path = process.env.OS_TF_PATH || '/home/ipam/terraform'
const local_tf_path = process.env.LOCAL_TF_PATH || '/terraform'

exports.os_scripts_path = os_scripts_path
exports.os_tf_path = os_tf_path
exports.os_files_path = os_files_path