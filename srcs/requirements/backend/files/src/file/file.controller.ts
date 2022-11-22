import { Req, Res, Controller, Post, UploadedFile, UseGuards, UseInterceptors, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { Request, Response, Express } from 'express';
import { FileService } from 'src/file/file.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};

@ApiTags('Transcendence API Collection')
@Controller('file')
export class FileController {

    constructor (
        private readonly fileService: FileService,
    ) {}

    @ApiOperation({ summary: 'Image upload API', description: 'post로 image data 전달' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
            file: {
                type: 'string',
                format: 'binary',
            },
            },
        },
    })
    @UseGuards(AuthGuard('token'))
    @Post('/upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './user_profile_images',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async create(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        const path = file.path.replace('user_profile_images/', '');
        const fileName = file.originalname;
        const savedPath = path.replace(/\\/gi, '/');
        const size = file.size;
        const result = await this.fileService.requestUpdate(req.cookies['token'], savedPath);
        
        return { fileName, savedPath, size, result };
    }

    @ApiOperation({ summary: 'Image download API', description: 'response의 sendFile로 이미지 전달' })
    @ApiBody({
        required: true,
        schema: {
            properties: { data: { type: "string" } }
        },
    })
    @UseGuards(AuthGuard('token'))
    @Post('/download')
    downloadFile(@Req() req: Request, @Res() res: Response) {
        const path = req.body.data;
        return res.sendFile(path, { root: './user_profile_images' });
    }

    // @UseGuards(AuthGuard('token'))
    // @Get('/test')
    // test(@Req() req: Request) {
    //     const rst = this.fileService.requestUpdate(req.cookies['token'], 'avatar.png');
    //     console.log('rst', rst);
    //     console.log(typeof rst);
    // }
}
