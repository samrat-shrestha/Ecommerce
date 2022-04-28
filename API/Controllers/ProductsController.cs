using Infrastructure.Data;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Interfaces;
using Core.Specifications;
using API.DTOs;
using System.Linq;
using AutoMapper;
using API.Errors;
using Microsoft.AspNetCore.Http;
using API.Helpers;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        //private readonly IProductRepository _productContext;
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IGenericRepository<ProductType> _productTypeRepository;
        private readonly IMapper _mapper;
        public readonly IGenericRepository<ProductBrand> _productBrandRepository;

        public ProductsController(IGenericRepository<Product> productRepository,
            IGenericRepository<ProductBrand> productBrandRepository,
            IGenericRepository<ProductType> productTypeRepository,
            IMapper mapper)
        {
            //_productContext = productContext;
            _productRepository = productRepository;
            _productBrandRepository = productBrandRepository;
            _productTypeRepository = productTypeRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts([FromQuery]ProductSpecParams productParams)
        {
            //var products = await _productContext.GetProductsAsync();

            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);

            var countSpec = new ProductWithFiltersForCountSpecification(productParams);

            var totalItems = await _productRepository.CountAsync(countSpec);

            var products = await _productRepository.GetAsync(spec);

            //return Ok(products.Select(x => _mapper.Map<Product, ProductToReturnDto>(x)).ToList());
            //return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products));
            var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

            return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex, productParams.PageSize, totalItems, data));
        }

        [HttpGet("{id}")]
        //These lines are for documenting on swagger.
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            //var productData = await _productContext.GetProductByIdAsync(id);

            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            
            var productData = await _productRepository.GetEntityWithSpec(spec);

            if (productData == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<Product, ProductToReturnDto>(productData);
        }

        [HttpGet]
        [Route("brands")]
        public async Task<ActionResult<List<ProductBrand>>> GetProductBrands()
        {
            //var productBrandData = await _productContext.GetProductBrandsAsync();
            var productBrandData = await _productBrandRepository.GetAllAsync();

            return Ok(productBrandData);
        }

        [HttpGet]
        [Route("types")]
        public async Task<ActionResult<List<ProductType>>> GetProductTypes()
        {
            //var productTypes = await _productContext.GetProductTypesAsync();
            var productTypes = await _productTypeRepository.GetAllAsync();

            return Ok(productTypes);
        }
    }
}
