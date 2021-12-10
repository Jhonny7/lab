export class NewModel {
    public id: number;
    public idNegocio: number;
    public titulo: string;
    public descripcion: string;
    public html: string;
    public dateAt: string;

    constructor();

    constructor(
        id?: number,
        idNegocio?: number,
        titulo?: string,
        descripcion?: string,
        html?: string,
        dateAt?: string
    );

    constructor(
        id?: number,
        idNegocio?: number,
        titulo?: string,
        descripcion?: string,
        html?: string,
        dateAt?: string
    ) {
        this.id = id;
        this.idNegocio = idNegocio;
        this.html = html;
        this.descripcion = descripcion;
        this.titulo = titulo;
        this.dateAt = dateAt;
    }

    public static fromJson(obj: any) {
        return new NewModel(obj.id, obj.id_negocio, obj.titulo, obj.descripcio, obj.html, obj.date_ad)
    }
}