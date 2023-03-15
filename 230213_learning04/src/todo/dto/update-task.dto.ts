import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class updateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}