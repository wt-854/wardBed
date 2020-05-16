import { element, by, ElementFinder } from 'protractor';

export class BedComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-bed div table .btn-danger'));
  title = element.all(by.css('jhi-bed div h2#page-heading span')).first();
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

export class BedUpdatePage {
  pageTitle = element(by.id('jhi-bed-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  bedReferenceIdInput = element(by.id('field_bedReferenceId'));
  bedNameInput = element(by.id('field_bedName'));
  wardAllocationDateInput = element(by.id('field_wardAllocationDate'));

  wardSelect = element(by.id('field_ward'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setBedReferenceIdInput(bedReferenceId: string): Promise<void> {
    await this.bedReferenceIdInput.sendKeys(bedReferenceId);
  }

  async getBedReferenceIdInput(): Promise<string> {
    return await this.bedReferenceIdInput.getAttribute('value');
  }

  async setBedNameInput(bedName: string): Promise<void> {
    await this.bedNameInput.sendKeys(bedName);
  }

  async getBedNameInput(): Promise<string> {
    return await this.bedNameInput.getAttribute('value');
  }

  async setWardAllocationDateInput(wardAllocationDate: string): Promise<void> {
    await this.wardAllocationDateInput.sendKeys(wardAllocationDate);
  }

  async getWardAllocationDateInput(): Promise<string> {
    return await this.wardAllocationDateInput.getAttribute('value');
  }

  async wardSelectLastOption(): Promise<void> {
    await this.wardSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async wardSelectOption(option: string): Promise<void> {
    await this.wardSelect.sendKeys(option);
  }

  getWardSelect(): ElementFinder {
    return this.wardSelect;
  }

  async getWardSelectedOption(): Promise<string> {
    return await this.wardSelect.element(by.css('option:checked')).getText();
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

export class BedDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-bed-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-bed'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
