resource "vsphere_virtual_machine" "linux_vm_template" {

  for_each = {
    for vm in var.vm_specs : vm.vm_name => vm
  }

  name             = each.value.vm_name
  num_cpus         = each.value.vcpu
  memory           = each.value.ram
  datastore_id     = data.vsphere_datastore.datastore.id
  datacenter_id    = data.vsphere_datacenter.datacenter.id
  resource_pool_id = data.vsphere_resource_pool.vcenter_rp.id
  guest_id         = data.vsphere_virtual_machine.vm_template[0].guest_id
  scsi_type        = data.vsphere_virtual_machine.vm_template[0].scsi_type

  disk {
    label            = "disk0"
    size             = each.value.storage
    thin_provisioned = data.vsphere_virtual_machine.vm_template[0].disks.0.thin_provisioned
  }

  network_interface {
    network_id   = data.vsphere_network.public_network.id
    adapter_type = data.vsphere_virtual_machine.vm_template[0].network_interface_types[0]
  }

  cdrom {
    client_device = true
  }

  extra_config = {
    "ethernet0.pciSlotNumber" = "${var.nic_pciSlotNumber}"
  }

  clone {
    template_uuid = data.vsphere_virtual_machine.template[0].id
  }

  vapp {
    properties = {
      "instance-id" = each.value.vm_name
      "hostname"    = each.value.hostname
      "user-data"   = var.is_static_ip ? base64encode(data.template_file.userdata_static[each.key].rendered) : base64encode(data.template_file.userdata_dhcp[each.key].rendered)
    }
  }
}