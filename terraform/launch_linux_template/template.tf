data "vsphere_virtual_machine" "vm_template" {
  name          = var.template_name
  datacenter_id = data.vsphere_datacenter.datacenter.id
}
