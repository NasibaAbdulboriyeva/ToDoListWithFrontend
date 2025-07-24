import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { AuthApiService } from '../api/auth-api-service';
import { SignUpDto } from '../api/interfaces/sign-up-dto';
import { SignUpModel } from './models/sign-up-model';
import { LoginModel } from './models/login-model';
import { LoginDto } from '../api/interfaces/login-dto';
import { LoginResponseDto } from '../api/interfaces/login-response-dto';
import { LoginResponseModel } from './models/login-response-model';
import { isPlatformBrowser } from '@angular/common';
import { Router } from 'express';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private authApiService: AuthApiService, private router: Router ) { }

    public signUp(model: SignUpModel): Observable<number> {
        const dto = this.convertSignUpModelToDto(model);
        return this.authApiService.signUp(dto);
    }

    public login(model: LoginModel): Observable<LoginResponseModel> {
        const dto = this.convertLoginModelToDto(model);
        return this.authApiService.login(dto).pipe(
            tap(responseDto => {
                localStorage.setItem('access_token', responseDto.accessToken);
                localStorage.setItem('refresh_token', responseDto.refreshToken);
            }),
            map(responseDto => this.convertLoginResponseDtoToModel(responseDto))
        );
    }

    public logout(): void {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            return;
        }
        this.authApiService.logout(refreshToken).subscribe(() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        });
    }

    public getAccessToken1(): string | null {
        return localStorage.getItem('access_token');
    }

    private platformId = inject(PLATFORM_ID);

    public getAccessToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('access_token');
        }
        return null; 
    }

    public getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    public refreshToken(): Observable<LoginResponseModel> | undefined {
        const refreshToken = this.getRefreshToken();
        const accessToken = this.getAccessToken();
        if (!refreshToken) return;
        if (!accessToken) return;
        return this.authApiService.refreshToken(accessToken, refreshToken).pipe(
            tap(res => {
                localStorage.setItem('access_token', res.accessToken);
                localStorage.setItem('refresh_token', res.refreshToken);
            })
        );
    }

    public isLoggedIn(): boolean {
        return !!this.getAccessToken();
    }

    private convertSignUpModelToDto(model: SignUpModel): SignUpDto {
        return {
            firstName: model.firstName,
            lastName: model.lastName,
            userName: model.userName,
            email: model.email,
            password: model.password,
            phoneNumber: model.phoneNumber
        };
    }

    public testApi(): Observable<any> {
        return this.authApiService.testGetAll();
    }

    private convertLoginModelToDto(model: LoginModel): LoginDto {
        return {
            userName: model.userName,
            password: model.password,
        };
    }

    private convertLoginResponseDtoToModel(dto: LoginResponseDto): LoginResponseModel {
        return {
            accessToken: dto.accessToken,
            refreshToken: dto.refreshToken,
            tokenType: dto.tokenType,
            expires: dto.expires
        };
    }
}
