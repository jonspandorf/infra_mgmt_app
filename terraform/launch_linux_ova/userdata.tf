data "template_file" "userdata_static" {
  for_each = { for vm in var.vm_specs : vm.vm_name => vm }
  template = file("${path.module}/templates/userdata-static.yaml")
  vars = {
    mgmt_nic       = "${var.mgmt_nic}"
    mask           = "${var.mask}"
    ns1            = "${var.nameserver1}"
    ns2            = "${var.nameserver2}"
    username       = "${each.value.username}"
    password       = "${each.value.password}"
    ipaddress      = "${each.value.static_ip}"
    defaultgateway = "${each.value.dg}"
  }
}

data "template_file" "userdata_dhcp" {
  for_each = { for vm in var.vm_specs : vm.vm_name => vm }
  template = file("${path.module}/templates/userdata.yaml")
  vars = {
    username = each.value.username
    password = each.value.password
  }
}
