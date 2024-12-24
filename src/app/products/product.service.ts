import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Product } from './product';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  private http = inject(HttpClient);
  private reviewService = inject(ReviewService); 

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(data => console.log(data)),
        catchError(err => this.handleError(err))
      )
  }

  getProduct(id: number): Observable<Product> {
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl)
      .pipe(
        switchMap(product => this.getReviewsByProduct(product)),
        catchError(err => this.handleError(err))
      )
  }

  getReviewsByProduct(product: Product): Observable<Product> {
    if(product.hasReviews) {
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(
          map((reviews) => {
            return {...product, reviews} as Product
          })
        )
    } else {
      return of(product);
    }
  }

  handleError(err: HttpErrorResponse): Observable<never>  {
    throw 'Something is wrong! Please try again!';
  }

}
