# nest-angular-starter
This is a repo for a starter appliation for a Single Page MEAN Stack application
includes nest js + angular 7 + angular material + client api generator.

## Installation 
```sh
npm i
```

## client api generator
#### server controller:
```typescript
@Controller('rest/auth')
export class AuthController {
    @Post('login')
    async login(@Body() user: LoginRequest, @Req() req): Promise<User> {
        return req.user;
    }
    @Get('getUserAuthenticated')
    async getUserAuthenticated(@Req() req) {
        return {user:req.user};
    }
}
```
#### Run 
```sh
npm run gen-client
```
#### End you get:
```typescript
export class AuthController {
    async login(user: LoginRequest): Promise<User> {
        return new Promise((resolve) => post('rest/auth/login',user).then((data:any) => resolve(plainToClass(User,<User>data))))
    }
    async getUserAuthenticated(): Promise<{ user: any; }> {
        return new Promise((resolve) => get('rest/auth/getUserAuthenticated').then((data:any) => resolve(data)))
    }
}
```

#### Extend service with api
```typescript
import { AuthController } from "src/api/auth.controller";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthService extends AuthController{
}
```

## class-transformer
#### User class
```typescript
export class User extends Entity{
    fName: string;
    lName: string;
    roles:Role[];
    get fullName() { return this.fName + ' ' + this.lName }
}
```
#### By using [class-tranformer](https://github.com/typestack/class-transformer) (auto generate), you can do:
```typescript
this.authService.login(this.form.value).then(user => {
    console.log(user.fullName)
})
```
## Shared validation using [class-validator](https://github.com/typestack/class-validator)
#### decorate the class with validations:
```typescript
export class LoginRequest {
    @IsEmail()
    email: string

    @Length(6,10)
    password: string
}
})
```

#### server validation
just use [validation pipe](https://docs.nestjs.com/techniques/validation)
#### client validation
```typescript
  constructor(private dynaFB: DynaFormBuilder) {
    this.dynaFB.buildFormFromClass(LoginRequest).then(form => this.form = form);
  }
  ```

## Debug with vscode
```sh
npm run debug-server
```
Hit F5 and select the process

## Future
-- Client generator with full types.

-- Auto transform result to real object

-- Share models between server & client
