import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateCartItemsDto } from './dto/create-cart.dto';
import { UpdateCartItemsDto } from './dto/update-cart.dto';
import { messages } from '@/common/resources';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { WinstonContextLogger } from '@/winston-context/winston-context.logger';
import { CartsRepository } from './carts.repository';
import { CartItemsRepository } from './cart-items.repository';

@Injectable()
export class CartsService {
  constructor(
    private readonly cLogger: WinstonContextLogger,
    private readonly repo: CartsRepository,
    private readonly cartItemRepo: CartItemsRepository,
  ) {}

  async create(userId: number, createCartItemsDto: CreateCartItemsDto) {
    try {
      let cartId: number | null;
      const cart = await this.repo.findCart(userId);
      if (!cart) {
        const newCart = await this.createCart(userId);
        cartId = newCart.id;
      } else {
        cartId = cart.id;
      }

      const newCartItem = await this.createCartItem(
        cartId,
        createCartItemsDto.product_id,
        createCartItemsDto.quantity,
      );

      return newCartItem;
    } catch (err) {
      this.cLogger.error(err);
      throw err;
    }
  }

  async getCartData(id: number) {
    try {
      const cartData = await this.repo.findCart(id);
      const cartId = cartData.id;
      if (!cartId) {
        throw new UnprocessableEntityException(
          messages.CART_NOT_FOUNT_EXCEPTION,
        );
      }

      return await this.cartItemRepo.findAllCartData(cartId);
    } catch (err) {
      this.cLogger.error(err);
      throw err;
    }
  }

  async update(
    userId: number,
    productId: number,
    updateCartItemsDto: UpdateCartItemsDto,
  ) {
    try {
      const cartData = await this.repo.findCart(userId);
      const cartId = cartData.id;
      if (!cartId) {
        throw new UnprocessableEntityException(
          messages.CART_NOT_FOUNT_EXCEPTION,
        );
      }

      const cartItem = await this.cartItemRepo.findCartItemByCartId(
        cartId,
        productId,
      );
      if (cartItem) {
        cartItem.quantity = updateCartItemsDto.quantity;
        cartItem.save();
      }
    } catch (err) {
      this.cLogger.error(err);
      throw err;
    }
  }

  async remove(userId: number, productId: number) {
    try {
      const cartData = await this.repo.findCart(userId);
      const cartId = cartData.id;
      if (!cartId) {
        throw new UnprocessableEntityException(
          messages.CART_NOT_FOUNT_EXCEPTION,
        );
      }
      await CartItemEntity.delete({
        cart_id: cartId,
        product: productId,
      });
    } catch (err) {
      this.cLogger.error(err);
      throw err;
    }
  }

  private async createCart(id: number) {
    try {
      const cart = CartEntity.create({
        customer_id: id,
      });
      await this.repo.create(cart);
      return cart.toCart();
    } catch (err) {
      this.cLogger.error(err);
      throw new UnprocessableEntityException(messages.CART_NOT_FOUNT_EXCEPTION);
    }
  }

  private async createCartItem(
    cart_id: number,
    product_id: number,
    quantity: number,
  ) {
    try {
      const cartItem = CartItemEntity.create({
        cart_id,
        product: product_id,
        quantity,
      });
      await this.cartItemRepo.create(cartItem);
      return cartItem.toCartItem();
    } catch (err) {
      this.cLogger.error(err);
      throw new UnprocessableEntityException(messages.CART_NOT_FOUNT_EXCEPTION);
    }
  }
}