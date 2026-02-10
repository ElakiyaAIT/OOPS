import { IsNotEmpty,IsArray, IsString, IsEmail, MinLength, IsInt, Min, Max, IsOptional, IsMongoId } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;


  @IsEmail()
  email: string;

  @IsInt()
  @Min(0)
  @Max(120)
  age:number;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({each:true})
  role?:string[];
}
