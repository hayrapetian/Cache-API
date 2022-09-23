import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePostDto {

  @ApiProperty({
    description: 'Text to update a post',
    default: 'Apple introduces iPhone 14 and iPhone 14 Plus.'
  })
  @IsNotEmpty()

  info: string;
}
