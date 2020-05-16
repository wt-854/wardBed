import { element, by, ElementFinder } from 'protractor';

export class WardComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-ward div table .btn-danger'));
  title = element.all(by.css('jhi-ward div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class WardUpdatePage {
  pageTitle = element(by.id('jhi-ward-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  wardReferenceIdInput = element(by.id('field_wardReferenceId'));
  wardNameInput = element(by.id('field_wardName'));
  wardClassTypeSelect = element(by.id('field_wardClassType'));
  wardLocationSelect = element(by.id('field_wardLocation'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setWardReferenceIdInput(wardReferenceId: string): Promise<void> {
    await this.wardReferenceIdInput.sendKeys(wardReferenceId);
  }

  async getWardReferenceIdInput(): Promise<string> {
    return await this.wardReferenceIdInput.getAttribute('value');
  }

  async setWardNameInput(wardName: string): Promise<void> {
    await this.wardNameInput.sendKeys(wardName);
  }

  async getWardNameInput(): Promise<string> {
    return await this.wardNameInput.getAttribute('value');
  }

  async setWardClassTypeSelect(wardClassType: string): Promise<void> {
    await this.wardClassTypeSelect.sendKeys(wardClassType);
  }

  async getWardClassTypeSelect(): Promise<string> {
    return await this.wardClassTypeSelect.element(by.css('option:checked')).getText();
  }

  async wardClassTypeSelectLastOption(): Promise<void> {
    await this.wardClassTypeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async setWardLocationSelect(wardLocation: string): Promise<void> {
    await this.wardLocationSelect.sendKeys(wardLocation);
  }

  async getWardLocationSelect(): Promise<string> {
    return await this.wardLocationSelect.element(by.css('option:checked')).getText();
  }

  async wardLocationSelectLastOption(): Promise<void> {
    await this.wardLocationSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class WardDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-ward-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-ward'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
