class LaptopBuilder {
  constructor() {
    this.reset()
  }

  reset() {
    this.laptop = {
      name: '',
      displayName: '',
      brand: '',
      type: '',
      nameSlug: '',
      purchasePrice: 0,
      discount: 0,
      price: 0,
      quantity: 0,
      description: '',
      mainImg: '',
      images: [],
      attributeGroup: [],
      specs: [],
      options: [],
      isPublish: false,
      createdAt: Date.now(),
      updatedAt: null,
      isDeleted: false
    }
  }

  // Basic Information
  setName(name) {
    if (!name?.trim()) {
      throw new Error('Name is required')
    }
    this.laptop.name = name.trim()
    return this
  }

  setDisplayName(displayName) {
    this.laptop.displayName = displayName?.trim() || ''
    return this
  }

  setBrand(brandId) {
    if (!brandId) {
      throw new Error('Brand is required')
    }
    this.laptop.brand = brandId
    return this
  }

  setType(typeId) {
    if (!typeId) {
      throw new Error('Type is required')
    }
    this.laptop.type = typeId
    return this
  }

  setNameSlug(nameSlug) {
    this.laptop.nameSlug = nameSlug
    return this
  }

  // Pricing
  setPricing(purchasePrice, price, discount = 0) {
    if (price <= 0) {
      throw new Error('Price must be greater than 0')
    }
    if (discount < 0 || discount > 100) {
      throw new Error('Discount must be between 0 and 100')
    }
    this.laptop.purchasePrice = Number(purchasePrice) || 0
    this.laptop.price = Number(price)
    this.laptop.discount = Number(discount)
    return this
  }

  setQuantity(quantity) {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative')
    }
    this.laptop.quantity = Number(quantity)
    return this
  }

  // Media
  setMainImage(mainImg) {
    this.laptop.mainImg = mainImg?.trim() || ''
    return this
  }

  addImage(image) {
    if (image?.trim()) {
      this.laptop.images.push(image.trim())
    }
    return this
  }

  setImages(images) {
    this.laptop.images = Array.isArray(images) ? images.filter(img => img?.trim()) : []
    return this
  }

  // Description
  setDescription(description) {
    this.laptop.description = description?.trim() || ''
    return this
  }

  // Specifications
  addSpecification(spec) {
    if (!spec?.storage?.trim() || !spec?.gpu?.trim()) {
      throw new Error('Storage and GPU are required in specifications')
    }
    this.laptop.specs.push({
      cpu: spec.cpu?.trim() || '',
      ram: spec.ram?.trim() || '',
      storage: spec.storage.trim(),
      gpu: spec.gpu.trim(),
      screen: spec.screen?.trim() || ''
    })
    return this
  }

  setSpecifications(specs) {
    if (!Array.isArray(specs) || specs.length === 0) {
      throw new Error('At least one specification is required')
    }
    this.laptop.specs = specs.map(spec => ({
      cpu: spec.cpu?.trim() || '',
      ram: spec.ram?.trim() || '',
      storage: spec.storage?.trim() || '',
      gpu: spec.gpu?.trim() || '',
      screen: spec.screen?.trim() || ''
    }))
    return this
  }

  // Attributes
  addAttribute(name, values) {
    if (name?.trim() && values?.trim()) {
      this.laptop.attributeGroup.push({ 
        name: name.trim(), 
        values: values.trim() 
      })
    }
    return this
  }

  setAttributes(attributes) {
    this.laptop.attributeGroup = Array.isArray(attributes) 
      ? attributes.filter(attr => attr.name?.trim() && attr.values?.trim())
      : []
    return this
  }

  // Options
  addOption(option) {
    if (option?.name?.trim() && Array.isArray(option.options)) {
      this.laptop.options.push({
        name: option.name.trim(),
        options: option.options.map(opt => ({
          value: opt.value?.trim() || '',
          images: Array.isArray(opt.images) ? opt.images : []
        }))
      })
    }
    return this
  }

  setOptions(options) {
    this.laptop.options = Array.isArray(options) 
      ? options.filter(opt => opt.name?.trim() && Array.isArray(opt.options))
      : []
    return this
  }

  // Publishing
  setPublishStatus(isPublish) {
    this.laptop.isPublish = Boolean(isPublish)
    return this
  }

  // Build
  build() {
    const laptop = { ...this.laptop }
    this.reset()
    return laptop
  }
}

// Service class
export class LaptopService {
  constructor() {
    this.builder = new LaptopBuilder()
  }

  createLaptop(data) {
    try {
      return this.builder
        .setName(data.name)
        .setDisplayName(data.displayName)
        .setBrand(data.brand)
        .setType(data.type)
        .setNameSlug(data.nameSlug)
        .setPricing(data.purchasePrice, data.price, data.discount)
        .setQuantity(data.quantity)
        .setDescription(data.description)
        .setMainImage(data.mainImg)
        .setImages(data.images)
        .setSpecifications(data.specs)
        .setAttributes(data.attributeGroup)
        .setOptions(data.options)
        .setPublishStatus(data.isPublish)
        .build()
    } catch (error) {
      throw new Error(`Failed to create laptop: ${error.message}`)
    }
  }
}

export const laptopService = new LaptopService()
