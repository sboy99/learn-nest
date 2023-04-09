import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  // Check for valid UUID
  checkForValidUuid = <T = string>(
    id: T,
    errMessage = 'id Should be a valid UUID'
  ): true | never => {
    const uuidPattern = new RegExp(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    if (uuidPattern.test(id as string)) return true;
    throw new BadRequestException(errMessage);
  };
}
