import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class createTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}