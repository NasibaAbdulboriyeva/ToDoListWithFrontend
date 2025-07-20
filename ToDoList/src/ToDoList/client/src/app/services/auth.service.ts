import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthApiService } from '../api/auth-api-service';
import { SignUpDto } from '../api/interfaces/sign-up-dto';
import { SignUpModel } from './models/sign-up-model';
import { LoginModel } from './models/login-model';
import { LoginDto } from '../api/interfaces/login-dto';
import { LoginResponseDto } from '../api/interfaces/login-response-dto';
import { LoginResponseModel } from './models/login-response-model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private authApiService: AuthApiService) {}

    public signUp(model: SignUpModel): Observable<number> {
        const dto = this.convertSignUpModelToDto(model);
        return this.authApiService.signUp(dto);
    }

    public login(model: LoginModel): Observable<LoginResponseModel> {
        const dto = this.convertLoginModelToDto(model);
        return this.authApiService.login(dto).pipe(
            map(responseDto => this.convertLoginResponseDtoToModel(responseDto)));
       
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
